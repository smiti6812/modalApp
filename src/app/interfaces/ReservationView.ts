import { DateTime, Info, Interval} from 'luxon';
import { Room } from '../interfaces/Room'

export interface ReservationView{
  room: Room,
  monthDays: any [],
  days: any [],
  dayDates: DateTime [],
  reservationSaved: boolean [],
  colspan: number []
}
