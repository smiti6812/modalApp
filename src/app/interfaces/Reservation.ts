import { DateTime, Info, Interval} from 'luxon';
import { Room } from '../interfaces/Room'

export interface Reservation{
  reservedRoom: Room,
  startDate: DateTime,
  endDate: DateTime,
  name: string,
  email: string,
  payed: boolean
  days: any []
}
