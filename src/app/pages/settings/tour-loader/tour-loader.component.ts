import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TicketService } from 'src/app/services/ticket/ticket.service';

@Component({
  selector: 'app-tour-loader',
  
  imports: [],
  template: `<p>tour-loader works!</p>`,
  styleUrls: ['./tour-loader.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TourLoaderComponent implements OnInit {
  tourForm:FormGroup;
  constructor(private ticketService:TicketService) {}

  
  ngOnInit(): void {
    this.tourForm = new FormGroup( {
      name: new FormControl('',{validators:Validators.required}),
      description: new FormControl ('', [Validators.required,Validators.minLength]),
      operator: new FormControl(),
      price: new FormControl(),
      img: new FormControl()
      
    });
}
createTour(): void {
  const tourDataRow = this.tourForm.getRawValue();
  let formParams = new FormData();
  if (typeof tourDataRow === "object"){
    for (let prop in tourDataRow ){
      formParams.append(prop,tourDataRow[prop])
    }
  }
}
this.ticketService.createTour(formParams).subscribe( (data)=>{});

}

selectFile(ev:any) : void {
if (Array.isArray(eval.target.files) && ev.target.files.lenght >0){
  const file = ev.target.files[0];
  this.tourForm.patchValue( {img: file});
}
  }