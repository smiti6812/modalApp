import { Component, Input, Inject, NgModule, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from "@angular/common";
import {FormControl, FormGroup, ReactiveFormsModule, FormsModule, Validators} from '@angular/forms';
import { ReservationForm } from '../interfaces/ReservationForm';
import { DateTime, Info, Interval} from 'luxon';

@Component({
  selector: 'app-reservationform',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './reservationform.component.html',
  styleUrl: './reservationform.component.css'
})
export class ReservationformComponent implements OnInit {
  @Input() reservationForm: ReservationForm;
  @Output() submitReservationForm = new EventEmitter<ReservationForm>();
  @Output() cancelReservationForm = new EventEmitter();
 reservationGroup: FormGroup;

  constructor(){
  }

  ngOnInit(): void {
    this.reservationGroup = new FormGroup({
      name : new FormControl('', [Validators.required]),
      email : new FormControl('', [Validators.required, Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/)]),
      roomNumber: new FormControl(this.reservationForm.roomNumber),
      status: new FormControl(this.reservationForm.status),
      capacity: new FormControl(this.reservationForm.capacity),
      startDate : new FormControl(this.reservationForm.startDate.toISODate()),
      endDate : new FormControl(this.reservationForm.endDate.toISODate())
    });
  }
  get name() {
    return this.reservationGroup.get('name');
  }
  get email() {
    return this.reservationGroup.get('email');
  }
  submitForm(){
    this.reservationForm.name = this.reservationGroup.value.name;
    this.reservationForm.email = this.reservationGroup.value.email;
    this.submitReservationForm.emit(this.reservationForm);
    this.reservationForm = {} as ReservationForm;
  }
  cancelForm(){
    this.reservationForm = {} as ReservationForm;
    this.cancelReservationForm.emit();
  }
}
