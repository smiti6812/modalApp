import { Component, Input, Inject, NgModule, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReservationView } from '../interfaces/ReservationView';
import { Reservation } from '../interfaces/Reservation';
import { DateTime, Info, Interval} from 'luxon';
import { HotelService } from '../HotelService';
import { FilterPipe } from '../filter.pipe';
import { FormsModule } from '@angular/forms';
import { SortPipe } from '../../pipes/sort.pipe';
import { SortParamsDirective } from '../sorting/sort.params.directive';
import { ReservationformComponent } from '../reservationform/reservationform.component';
import { ReservationForm } from '../interfaces/ReservationForm';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule, FilterPipe, FormsModule, SortPipe, SortParamsDirective, ReservationformComponent],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
})

export class HotelComponent {
  @ViewChild('search') searchElement: ElementRef;
  @Input() reservationView!: ReservationView[];
  @Input() daysInMonthArr!: any [];
  @Input() selectedDateArr!: boolean  [][];
  @Input() reservationSaved!: boolean [][];
  @Input() reservationStartSaved!: boolean [][];
  @Input() reservations!: Reservation [];
  @Input() reservationMonths: number [];
  @Input() selected: any[] = [];
  @Input() selectedRow: number = -1;
  @Input() start: number = -1;
  @Input() end: number = -1;
  showModal: boolean = false;
  months: number = 3;
  pageSelectedDate:DateTime = DateTime.now();
  daysInMonth: number = DateTime.now().daysInMonth;
  hotelService: HotelService = Inject(HotelService);
  imageSortName ='../assets/sortAsc.png';
  isSorted: number = 0;
  searchText: string = '';
  column:string = 'Room';
  direction:string = 'asc';
  type:string = 'string';
  res: Reservation = {} as Reservation;
  reservationForm: ReservationForm = {} as ReservationForm;


  constructor(private _hotelService: HotelService){
    this.selectedDateArr = [];
    this.reservations = [];
    this.reservationSaved = [];
    this.reservationStartSaved = [];
    this.hotelService = _hotelService;
    this.daysInMonthArr = this.hotelService.getDaysInMonth(this.pageSelectedDate);
    this.reservationView = this.hotelService.getReservationView(this.pageSelectedDate);
    this.reservationMonths = this.hotelService.monthArr;
    this.clearSelectedDateArr();
    this.updateReservedSavedFromReservation();
  }

  focusSearch(){
    setTimeout(()=>{
      this.searchElement.nativeElement.focus();
    },0);
  }
  cancelForm(e: any){
    this.showModal = false;
    this.start = -1;
    this.end = -1;
    this.selectedRow = -1;
    this.selected = [];
    this.clearSelectedDateArr();
    this.updateReservedSavedFromReservation();
    this.focusSearch();
  }

  getReservationForm(form: ReservationForm){
    let res: Reservation = <Reservation> {
      reservedRoom: form.view.room,
      name: form.name,
      email: form.email,
      startDate: form.startDate,
      endDate: form.endDate
    };
    for(let i = this.start; i <= this.end; i++){
      if (!this.selected.find(val => val === form.view.dayDates[i])){
        this.selected.push(form.view.dayDates[i]);
      }
      let row = this.reservationView.indexOf(form.view);
      this.selectedDateArr[row][i]= true;
    }

    form.view.reservationSaved[this.end] = true;
    form.view.reservationStartSaved[this.start -1] = true;
    if ( this.selected.length > 1){
      form.view.reservationName[this.start] = res.name;
    }
    else{
      form.view.reservationName[this.start - 1] = res.name;
    }
    this.res = res;
    this.reservations.push(res);
    this.showModal = false;
    this.start = -1;
    this.end = -1;
    this.selectedRow = -1;
  }

  setSortParams(param: any){
    this.direction = param.dir;
    this.column = param.col;
    this.type = param.typ;
    this.clearSelectedDateArr();
    this.updateReservedSavedFromReservation();
  }

  onMouseArrDown(row : number, col : number, date: DateTime, roomNumber: string){
      if (!this.checkReservation1(roomNumber, date)){
        this.clearSelectedDateArr();
        this.selected.push(date);
        this.selectedDateArr[row][col] = true;
        this.start = col + 1;
        this.selectedRow = row;
      }
    }

    onMouseArrOver(row: number, col: number, date: DateTime, roomNumber: string){
      console.log('checkReservation:'+this.checkReservation1(roomNumber, date));
      if (this.start > -1 && !this.checkReservation1(roomNumber, date)){
        console.log('start:' + this.start)
        console.log('selectedRow:' + this.selectedRow)
          if ( this.selectedRow === row){
            for(let i = this.start; i <= col; i++){
                this.selectedDateArr[row][col]= true;
            }
          }
          else{
            this.clearSelectedDateArr();
            this.selectedRow = -1;
          }

          if (this.end > col && this.end < this.daysInMonthArr.length){
            this.selectedDateArr[row][this.end]= false;
          }
          this.end = col;
        }
        else{
          for(let j = col; j>= this.start - 1; j--){
            this.selectedDateArr[row][j]= false;
          }
        }
    }

    openModalAndSelectRangeBoxForRoomArr(view: ReservationView, item: any, row: number, col: number, date: DateTime){
      if (this.start > -1 && this.selectedRow === row &&  !this.checkReservationInRange(row, this.start, col + 1)){
          this.end = col;
          if (item[this.start -1]){
            this.reservationForm.name = '';
            this.reservationForm = {} as ReservationForm;
            this.reservationForm.roomNumber = view.room.roomNumber;
            this.reservationForm.capacity = view.room.roomCapacity.capacity;
            this.reservationForm.status = view.room.status;
            this.reservationForm.startDate = item[this.start -1];
            this.reservationForm.endDate = item[col];
            this.reservationForm.view = view;
            this.showModal = true;
            //const diff = DateTime.local(res.endDate.year, res.endDate.month, res.endDate.day).
            //diff(DateTime.local(res.startDate.year, res.startDate.month, res.startDate.day), 'days').days + 1;
        }
      }
    }

    updateReservedSavedFromReservation(){
      for(let m = 0; m < this.reservationMonths.length; m++){
        let currMonthDate: DateTime = this.pageSelectedDate.plus({month:m});
        let currMonthReservations = this.reservations.filter(f => f.startDate.year === currMonthDate.year &&
          f.startDate.monthShort === currMonthDate.monthShort) as Reservation[];
          if (currMonthReservations[0]){
            currMonthReservations.forEach(item => {
            for(let i = 0; i < this.reservationView.length; i++){
              for(let j= 0; j < this.reservationView[i].dayDates.length; j++){
                if (this.reservationView[i].room.roomNumber === item.reservedRoom.roomNumber && this.reservationView[i].dayDates[j].year === item.endDate.year &&
                  this.reservationView[i].dayDates[j].month === item.endDate.month && this.reservationView[i].dayDates[j].day === item.endDate.day
                ){
                  this.reservationView[i].reservationSaved[j] = true;
                }
                if(this.reservationView[i].room.roomNumber === item.reservedRoom.roomNumber && this.reservationView[i].dayDates[j].year === item.startDate.year &&
                  this.reservationView[i].dayDates[j].month === item.startDate.month && this.reservationView[i].dayDates[j].day === item.startDate.day
                ){
                  this.reservationView[i].reservationStartSaved[j] = true;
                  if (item.startDate === item.endDate){
                    this.reservationView[i].reservationName[j] = item.name;
                  }
                  else{
                    this.reservationView[i].reservationName[j + 1] = item.name;
                  }
                }
              }
            }
          });
        }
      }
    }

    checkReservationInRange(row: number,start: number, end: number):boolean{
      for(let j = start; j <= end; j++ ){
        if (this.checkReservation(this.reservationView[row].room.roomNumber, j)){
          return true;
        }
      } date: DateTime
      return false;
    }

    deleteReservation(view: ReservationView, date: DateTime, row: number){
      let res = this.reservations.find(f => f.reservedRoom.roomNumber === view.room.roomNumber && f.startDate <= date && date <= f.endDate
      ) as Reservation;
      let newRes: Reservation[] = [];
      for(let j =0; j < this.reservations.length; j++)
      {
        if (this.reservations[j].reservedRoom.roomNumber != res.reservedRoom.roomNumber){
          newRes.push(this.reservations[j]);
        }
        else if (this.reservations[j].startDate != res.startDate &&
          this.reservations[j].endDate != res.endDate
        ){
          newRes.push(this.reservations[j]);
        }
      }
      this.reservations = newRes;
      for(let i = 0; i < view.dayDates.length; i++){
        if (view.room.roomNumber === res.reservedRoom.roomNumber && view.dayDates[i].year === res.endDate.year && view.dayDates[i].month === res.endDate.month &&
          view.dayDates[i].day === res.endDate.day
        ){
          view.reservationSaved[i] = false;
        }
        if (view.room.roomNumber === res.reservedRoom.roomNumber && view.dayDates[i].year === res.startDate.year && view.dayDates[i].month === res.startDate.month &&
          view.dayDates[i].day === res.startDate.day){
          view.reservationStartSaved[i] = false;
          if ( res.startDate === res.endDate){
            view.reservationName[i] = '';
          }
          else{
            view.reservationName[i + 1] = '';
          }
        }
      }
      this.clearSelectedDateArr();
      for(let j = res.startDate.day; j< res.endDate.day; j++){
          this.selectedDateArr[row][j] = false;
      }
      view.reservationSaved[res.endDate.day - 1] = false;
      view.reservationStartSaved[res.startDate.day -1] = false;
      if (res.days.length > 1){
        view.reservationName[res.startDate.day] = '';
      }
      else{
        view.reservationName[res.startDate.day -1] = '';
      }
    }

    closeModal = (): void => {
      this.showModal = false;
    }

    checkReservationStart(roomNumber:string, date: DateTime):boolean{
      if (this.reservations.filter(f => f.reservedRoom.roomNumber === roomNumber && (
        f.startDate === date))){
       return true;
     }
     return false;

    }

    checkReservation1(roomNumber: string, date: DateTime):boolean{
      if (this.reservations.find(f => f.reservedRoom.roomNumber === roomNumber &&
         f.startDate <= date && date <= f.endDate)){
        return true;
      }
      return false;
    }

    checkReservation(roomNumber: string, day: number):boolean{
      if (this.reservations.filter(f => f.reservedRoom.roomNumber === roomNumber &&
         f.startDate.monthShort === this.pageSelectedDate.monthShort &&
        f.startDate.year === this.pageSelectedDate.year).flatMap(fm => fm.days).find(d => d === day)){
        return true;
      }
      return false;
    }

    goToPreviousMonth(){
      this.reservationView = [] as ReservationView[];
      this.pageSelectedDate = this.pageSelectedDate.minus({months: 1})
      this.daysInMonth = this.pageSelectedDate.daysInMonth!;
      this.daysInMonthArr = this.hotelService.getDaysInMonth(this.pageSelectedDate);
      this.reservationView = this.hotelService.getReservationView(this.pageSelectedDate);
      this.clearSelectedDateArr();
      this.updateReservedSavedFromReservation();
    }

    goToNextMonth(){
      this.reservationView = [] as ReservationView[];
      this.pageSelectedDate = this.pageSelectedDate.plus({months: 1});
      this.daysInMonth = this.pageSelectedDate.daysInMonth!;
      this.daysInMonthArr = this.hotelService.getDaysInMonth(this.pageSelectedDate);
      this.reservationView = this.hotelService.getReservationView(this.pageSelectedDate);
      this.clearSelectedDateArr();
      this.updateReservedSavedFromReservation();
    }

    public clearSelectedDateArr(){
      for(let i = 0; i < this.reservationView.length;i++){
        this.selectedDateArr[i] = [];
        for(let j = 0; j< this.daysInMonthArr.length; j++){
          this.selectedDateArr[i][j] = false;
        }
      }
      this.selected = [];
    }

    public clearReservationSaved(){
      for(let i = 0; i < this.reservationView.length;i++){
        this.reservationSaved[i] = [];
        for(let j = 0; j< this.daysInMonthArr.length; j++){
          this.reservationSaved[i][j] = false;
        }
      }
    }
}
