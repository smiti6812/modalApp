

import {Injectable} from '@angular/core';
import { DateTime, Info, Interval} from 'luxon';
import { RoomCapacity } from './interfaces/RoomCapacity';
import { ReservationView } from './interfaces/ReservationView';


@Injectable({
  providedIn: 'root',
})

export class HotelService {

  constructor(){
  }

  public getDaysInMonth(pageSelectedDate: DateTime): any[] {

    let daysInMonth = pageSelectedDate.daysInMonth!;
    let daysInMonthArr: any[] = [];
    for(let i = 1; i<= daysInMonth; i++){
        daysInMonthArr.push({
            name: i,
            weekDay: pageSelectedDate.minus({days: pageSelectedDate.day}).plus({days: i}).weekdayShort,
            dayDates: pageSelectedDate.minus({days: pageSelectedDate.day}).plus({days: i})
          }
        );
    }

    return daysInMonthArr;
  }

   getRoomCapacity(): RoomCapacity[]{
    let roomTypes = [
      {
        roomCapacityId: 2,
        capacity: 2
      },
      {
        roomCapacityId: 3,
        capacity: 3,
      },
      {
        roomCapacityId: 4,
        capacity: 4,
      }
    ];
    return roomTypes;
  }

  getReservationView(pageSelectedDate: DateTime): ReservationView[]{
    let daysInMonth: number = pageSelectedDate.daysInMonth!;
    let reservationView   = [] as ReservationView[];
    for(let index = 0; index < 5; index++){
      let reservationView1: ReservationView = <ReservationView>{};
      reservationView1.room ={
        roomNumber: "Room" + (index + 1),
        roomCapacity : {roomCapacityId: 2, capacity :2},
        status: "available"
      }
      reservationView1.monthDays = [];
      reservationView1.days = [];
      reservationView1.dayDates = [];
      reservationView1.colspan = [];
      reservationView1.reservationSaved = [];
      for(let i = 1; i<= daysInMonth; i++){
        reservationView1.monthDays.push(pageSelectedDate.minus({days: pageSelectedDate.day}).plus({days: i}).weekdayShort);
        reservationView1.days.push(i);
        reservationView1.dayDates.push(pageSelectedDate.minus({days: pageSelectedDate.day}).plus({days: i}));
        reservationView1.reservationSaved.push(false);
        reservationView1.colspan.push(1);
      }
      reservationView.push(reservationView1);
    }

    for(let index = 5; index < 10; index++){
      let reservationView1: ReservationView = <ReservationView>{};
      reservationView1.room ={
        roomNumber: "Room" + (index + 1),
        roomCapacity : {roomCapacityId: 3, capacity :3},
        status: "available"
      }
      reservationView1.monthDays = [];
      reservationView1.days = [];
      reservationView1.dayDates = [];
      reservationView1.reservationSaved = [];
      reservationView1.colspan = [];
      for(let i = 1; i<= daysInMonth; i++){
        reservationView1.monthDays.push(pageSelectedDate.minus({days: pageSelectedDate.day}).plus({days: i}).weekdayShort);
        reservationView1.days.push(i);
        reservationView1.dayDates.push(pageSelectedDate.minus({days:pageSelectedDate.day}).plus({days: i}));
        reservationView1.reservationSaved.push(false);
        reservationView1.colspan.push(1);
      }
      reservationView.push(reservationView1);
    }
    for(let index = 10; index < 15; index++){
      let reservationView1: ReservationView = <ReservationView>{};
      reservationView1.room ={
        roomNumber: "Room" + (index + 1),
        roomCapacity : {roomCapacityId: 4, capacity :4},
        status: "available"
      }
      reservationView1.monthDays = [];
      reservationView1.days = [];
      reservationView1.dayDates = [];
      reservationView1.reservationSaved = [];
      reservationView1.colspan = [];
      for(let i = 1; i <= daysInMonth; i++){
        reservationView1.monthDays.push(pageSelectedDate.minus({days: pageSelectedDate.day}).plus({days: i}).weekdayShort);
        reservationView1.days.push(i);
        reservationView1.dayDates.push(pageSelectedDate.minus({days: pageSelectedDate.day}).plus({days: i}));
        reservationView1.reservationSaved.push(false);
        reservationView1.colspan.push(1);
      }
       reservationView.push(reservationView1);
    }
    return reservationView;
  }

}
