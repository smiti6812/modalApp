import { Pipe, PipeTransform } from '@angular/core';
import { ReservationView } from '../app/interfaces/ReservationView';

@Pipe({
  standalone:true,
  name: 'sort'
})

export class SortPipe implements PipeTransform{
    transform(items: ReservationView [],direction:string,column:string,type:string){
      let sortedItems= [] as ReservationView[];
      sortedItems = direction ==='asc' ?
      this.sortAscending(items,column,type):
      this.sortDescending(items,column,type)
      return sortedItems;
    }
    sortAscending(items: ReservationView[],column: string,type: string){
      let sortedItem = [] as ReservationView[];
      switch(column){
        case 'room' : {
          sortedItem = items.sort((a, b) =>{
            if(a.room.roomNumber < b.room.roomNumber) return -1;
            return 0;
          });
          break;
        }
        case 'beds' : {
          sortedItem = items.sort((a, b) =>{
            return a.room.roomCapacity.capacity - b.room.roomCapacity.capacity;
          });
          break;
        }
        default : {
          sortedItem = items;
          break;
        }

      }
      return sortedItem;
    }
    sortDescending(items: ReservationView[],column: string,type: string){
      let sortedItem = [] as ReservationView[];
      switch(column){
        case 'room' : {
          sortedItem = items.sort((a, b) =>{
          if((a.room.roomNumber.toUpperCase() > b.room.roomNumber.toUpperCase())){
             return -1;
          }
          return 0;
          });
          break;
        }
        case 'beds' : {
          sortedItem = items.sort((a, b) =>{
            return b.room.roomCapacity.capacity - a.room.roomCapacity.capacity;
          });
          break;
        }
        default : {
          sortedItem = items;
          break;
        }
      }
      return sortedItem;
    }
}
