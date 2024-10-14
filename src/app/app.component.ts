import { Component, TemplateRef, OnInit, signal, Signal, WritableSignal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterOutlet } from "@angular/router";
import { DateTime, Info, Interval} from 'luxon';
import { ReservationformComponent } from "./reservationform/reservationform.component";
import { HotelComponent } from "./hotel/hotel.component";


@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterOutlet, ReservationformComponent, HotelComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css"
})
export class AppComponent implements OnInit {

  constructor() {
  }

  ngOnInit() {

  }

}
