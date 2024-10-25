import { DateTime } from "luxon";

export interface ReservationForm{
  name: string,
  email: string,
  roomNumber: string,
  capacity: number,
  status: string,
  startDate: DateTime,
  endDate: DateTime
}
