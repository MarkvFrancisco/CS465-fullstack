// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-edit-trip',
//   imports: [],
//   templateUrl: './edit-trip.html',
//   styleUrl: './edit-trip.css',
// })
// export class EditTrip {}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { TripDataService } from '../services/trip-data';
import { Trip } from '../models/trip';

@Component({
  selector: 'app-edit-trip',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-trip.html', // Fixed filename to match your previous setup
  styleUrl: './edit-trip.css'      // Fixed filename to match your previous setup
})
export class EditTripComponent implements OnInit { // Changed class name to EditTrip to match your app configuration

  // Moved variables inside the class block
  public editForm!: FormGroup;
  trip!: Trip;
  submitted = false;
  message: string = '';

  // Moved constructor inside the class block
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private tripDataService: TripDataService
  ) {}

  ngOnInit(): void {
    // Retrieve stashed trip ID
    let tripCode = localStorage.getItem("tripCode");
    if (!tripCode) {
      alert("Something wrong, couldn't find where I stashed tripCode!");
      this.router.navigate(['']);
      return;
    }
    console.log('EditTripComponent::ngOnInit');
    console.log('tripcode:' + tripCode);

    this.editForm = this.formBuilder.group({
      _id: [],
      code: [tripCode, Validators.required],
      name: ['', Validators.required],
      length: ['', Validators.required],
      start: ['', Validators.required],
      resort: ['', Validators.required],
      perPerson: ['', Validators.required],
      image: ['', Validators.required],
      description: ['', Validators.required]
    });

    this.tripDataService.getTrip(tripCode)
      .subscribe({
        next: (value: any) => {
          this.trip = value;
          
          // If your API returns an array, value[0] works. If it returns an object, use value.
          if (Array.isArray(value)) {
            this.editForm.patchValue(value[0]);
          } else {
            this.editForm.patchValue(value);
          }

          if (!value || (Array.isArray(value) && value.length === 0)) {
            this.message = 'No Trip Retrieved!';
          } else {
            this.message = 'Trip: ' + tripCode + ' retrieved';
          }
          console.log(this.message);
        },
        error: (error: any) => {
          console.log('Error: ' + error);
        }
      });
  }

  public onSubmit() {
    this.submitted = true;
    if (this.editForm.valid) {
      this.tripDataService.updateTrip(this.editForm.value)
        .subscribe({
          next: (value: any) => {
            console.log(value);
            this.router.navigate(['']);
          },
          error: (error: any) => {
            console.log('Error: ' + error);
          }
        });
    }
  }

  // get the form short name to access the form fields
  get f() { return this.editForm.controls; }
}