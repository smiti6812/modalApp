import { Component, Input, Inject, NgModule } from '@angular/core';
import { CommonModule } from "@angular/common";
import { ReservationView } from '../interfaces/ReservationView';
import { Reservation } from '../interfaces/Reservation';
import { DateTime, Info, Interval} from 'luxon';
import { HotelService } from '../HotelService';

@Component({
  selector: 'app-hotel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hotel.component.html',
  styleUrl: './hotel.component.css'
})

export class HotelComponent {
  @Input() reservationView!: ReservationView[];
  @Input() daysInMonthArr!: any [];
  @Input() selectedDateArr!: boolean  [][];
  @Input() reservationSaved!: boolean [][];
  @Input() reservations!: Reservation [];
  start: number = -1;
  end: number = -1;
  selectedRow: number = -1;
  selected: any[] = [];
  showModal: boolean = false;
  pageSelectedDate:DateTime = DateTime.local();
  daysInMonth: number = DateTime.local().daysInMonth;
  hotelService: HotelService = Inject(HotelService);
  colspan: number [][] = [];

  constructor(private _hotelService: HotelService){
    this.selectedDateArr = [];
    this.reservations = [];
    this.reservationSaved = [];
    this.hotelService = _hotelService;
    this.daysInMonthArr = this.hotelService.getDaysInMonth(this.pageSelectedDate);
    this.reservationView = this.hotelService.getReservationView(this.pageSelectedDate);
    this.clearSelectedDateArr();
    this.updateReservedSavedFromReservation();
    this.setDefaultColspan();
  }

  setDefaultColspan(){
    for(let i = 0; i < this.reservationView.length;i++){
      this.colspan[i] = [];
      for(let j = 0; j< this.daysInMonthArr.length; j++){
        this.colspan[i][j] = 1;
      }
    }
  }

  onMouseArrDown(item: any,row : number, col : number){
    if (!this.checkReservationInRange(row, col + 1, col + 1)){
      this.clearSelectedDateArr();
      this.selected.push(item[col]);
      this.selectedDateArr[row][col] = true;
      this.start = col + 1;
      this.selectedRow = row;
    }

    }

    onMouseArrOver(row: number, col: number){
      console.log('mouseover: ' + this.start)
      if (this.start > -1 && !this.checkReservationInRange(row,this.start, col + 1)){

          if ( this.selectedRow === row){
            for(let i = this.start; i <= col; i++){
                this.selectedDateArr[row][col]= true;
            }
          }
          else{
            this.clearSelectedDateArr();
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

    openModalAndSelectRangeBoxForRoomArr(view: ReservationView, item: any, row: number, col: number){
      console.log('open modal: ' + this.start)
      console.log('open modal checkReservation: ' + this.checkReservationInRange(row,this.start, col + 1))
      console.log('open modal selectedRow: ' + this.selectedRow)
      console.log('open modal row: ' + row)
      console.log('open modal col: ' + col + 1)
      if (this.start > -1 && this.selectedRow === row &&  !this.checkReservationInRange(row,this.start, col + 1)){
          for(let i = this.start; i <= col; i++){
              if (!this.selected.find(val => val === item[i])){
                  this.selected.push(item[i]);
              }
              this.selectedDateArr[row][i]= true;
          }
          view.reservationSaved[this.start - 1] = true;
          if (this.selected[0]){
            this.showModal = true;
            let res: Reservation = <Reservation> {
              reservedRoom: view.room,
              name: 'gipsz jakab',
              startDate: this.selected[0],
              endDate: this.selected[this.selected.length -1]
            };

            const diff = DateTime.local(res.endDate.year, res.endDate.month, res.endDate.day).
            diff(DateTime.local(res.startDate.year, res.startDate.month, res.startDate.day), 'days').days + 1;
            view.colspan[this.start -1] = diff;

            //this.colspan[row][col -diff] = diff;
            //console.log('open modal colspan: ' + col + 1)

            let newDayDates: DateTime [] = [];
            let newMonthDays: any[] = [];
            let newDays: any[] = [];
              for(let i = 0; i < view.dayDates.length; i++){

                  if(view.dayDates[i] <= this.selected[0] || this.selected[0].plus({days: diff}) <= view.dayDates[i]){
                    newDayDates.push(view.dayDates[i])
                    newMonthDays.push(view.dayDates[i].weekdayShort);
                    newDays.push(view.dayDates[i].day);
                  }

              }
            console.log('new days:' + newDays)
            view.days = newDays;
            view.monthDays = newMonthDays;
            view.dayDates = newDayDates;

            res.days = [];
            let occupied: boolean = false;
            for(let i = 0; i < this.selected.length; i++){
              if (!this.checkReservation(view.room.roomNumber, this.selected[i].day)){
                res.days.push(this.selected[i].day);
              }
              else{
                occupied = true;
                return;
              }
          }
          if (!occupied){
            this.reservations.push(res);
          }
        }
      }

      this.start = -1;
      this.end = -1;
      this.selectedRow = -1;

    }

    setColspan(){

    }

    updateReservedSavedFromReservation(){
      let currMonthReservations = this.reservations.filter(f => f.startDate.year === this.pageSelectedDate.year &&
        f.startDate.monthShort === this.pageSelectedDate.monthShort) as Reservation[];
      if (currMonthReservations[0]){
          console.log('curr reservation: ' +currMonthReservations[0].reservedRoom.roomNumber);
          for(let j = 0 ; j < this.reservations.length; j++){
            console.log(this.reservations[j].reservedRoom.roomNumber + this.reservations[j].endDate.toLocaleString())
          }
        currMonthReservations.forEach(item => {
          for(let i = 0; i < this.reservationView.length; i++){
            console.log('days: ' + this.reservationView[i].days)
            for(let j= 0; j < this.reservationView[i].days.length; j++){
              if (this.reservationView[i].room.roomNumber === item.reservedRoom.roomNumber && this.reservationView[i].days[j] === item.endDate.day){
              this.reservationView[i].reservationSaved[item.endDate.day-1] = true;
              }
            }
          }
        });
      }
    }

    checkReservationInRange(row: number,start: number, end: number):boolean{
      for(let j = start; j <= end; j++ ){
        if (this.checkReservation(this.reservationView[row].room.roomNumber, j)){
          return true;
        }
      }
      return false;
    }

    deleteReservation(view: ReservationView, day: number, row: number){
      let res = this.reservations.find(f => f.reservedRoom.roomNumber === view.room.roomNumber && f.days[f.days.length-1] === day &&
        f.endDate.year === this.pageSelectedDate.year && f.endDate.monthShort === this.pageSelectedDate.monthShort && f.endDate.day === day
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
      console.log(newRes)
      let days = this.reservations.filter(f => f.reservedRoom.roomNumber === view.room.roomNumber).flatMap(fm => fm.days);
      console.log(res.startDate.day+ ' '+res.endDate.day)
      for(let j = res.startDate.day; j< res.endDate.day; j++){
          this.selectedDateArr[row][j] = false;
      }

      view.reservationSaved[day - 1] = false;
    }

    closeModal = (): void => {
      this.showModal = false;
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
      console.log(this.reservationView[0].days.length);
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
