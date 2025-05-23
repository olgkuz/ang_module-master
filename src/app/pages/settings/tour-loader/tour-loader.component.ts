import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TicketService } from 'src/app/services/ticket/ticket.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-tour-loader',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule
  ],
  templateUrl: './tour-loader.component.html',
  styleUrls: ['./tour-loader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourLoaderComponent implements OnInit {
  tourForm: FormGroup;

  constructor(private ticketService: TicketService) {}

  ngOnInit(): void {
    this.tourForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      operator: new FormControl(''),
      price: new FormControl(''),
      img: new FormControl(null),
    });
  }

  createTour(): void {
    const tourDataRow = this.tourForm.getRawValue();
    const formParams = new FormData();

    for (let prop in tourDataRow) {
      formParams.append(prop, tourDataRow[prop]);
    }

    this.ticketService.createTour(formParams).subscribe((data) => {
      console.log('Tour created:', data);
    });
  }

  selectFile(ev: any): void {
    if (ev.target.files.length > 0) {
      const file = ev.target.files[0];
      this.tourForm.patchValue({ img: file });
    }
  }
}
