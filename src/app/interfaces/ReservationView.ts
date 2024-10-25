import { DateTime, Info, Interval} from 'luxon';
import { Room } from '../interfaces/Room'

export interface ReservationView{
  room: Room,
  dayDates: DateTime [],
  reservationSaved: boolean [],
  reservationStartSaved: boolean[],
  reservationName: string[],
}
