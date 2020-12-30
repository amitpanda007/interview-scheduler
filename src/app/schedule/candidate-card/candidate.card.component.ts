import { Component, Input, OnInit } from "@angular/core";
import { ICandidate } from "../candidate";

@Component({
  selector: "candidate-card",
  templateUrl: "candidate.card.component.html",
  styleUrls: ["candidate.card.component.scss"],
})
export class CandidateCardComponent implements OnInit {
  @Input() candidate: ICandidate;
  constructor() {}

  ngOnInit(): void {}
}
