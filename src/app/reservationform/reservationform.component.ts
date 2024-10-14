import { Component } from '@angular/core';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-reservationform',
  standalone: true,
  imports: [],
  templateUrl: './reservationform.component.html',
  styleUrl: './reservationform.component.css'
})
export class ReservationformComponent {
    reservationForm = new FormControl('');
}
