import { Component, OnInit, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss']
})
export class RatingComponent implements OnInit{

  @Output() userRating: EventEmitter<number> = new EventEmitter<number>();

  constructor() { }

  ngOnInit(): void { }

  userRated(event) {
    const ratedValue = event.target.attributes.value.value;
    this.userRating.emit(ratedValue);
  }

}
