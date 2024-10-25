import { Pipe, PipeTransform } from '@angular/core';
import { ReservationView } from './interfaces/ReservationView';

@Pipe({
  standalone:true,
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(data: Array<ReservationView>, searchTxt: string ): Array<ReservationView> {
    if(searchTxt !== ''){
      return data.filter(f => f.room.roomNumber.toUpperCase().includes(searchTxt.toUpperCase()) ||
      f.room.roomCapacity.capacity.toString() === searchTxt);
    }
    else{
      return data;
    }
  }
}

