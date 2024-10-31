import { DateTime } from "luxon";
import { ReservationView } from "./ReservationView";

export interface ReservationForm{
  name: string,
  email: string,
  roomNumber: string,
  capacity: number,
  status: string,
  startDate: DateTime,
  endDate: DateTime,
  view: ReservationView
}
