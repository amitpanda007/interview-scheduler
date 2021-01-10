import { Component, Input, OnInit } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { ICandidate } from "../candidate";

@Component({
  selector: "candidate-list",
  templateUrl: "candidate.list.component.html",
  styleUrls: ["candidate.list.component.scss"],
})
export class CandidateListComponent implements OnInit {
  @Input() interviewId: string;
  candidates: any;
  filteredCandidates: any;

  constructor(private store: AngularFirestore) {}

  ngOnInit(): void {
    // const docs = "sn2iZul47lC7R6zmEFxp";
    this.store
      .collection("interviews")
      .doc(this.interviewId)
      .collection("candidates", (ref) => ref.orderBy("rank"))
      .valueChanges({ idField: "id" })
      .subscribe((candidates) => {
        this.candidates = this.filteredCandidates = candidates;
      });
  }

  filterCandidates(data) {
    if (data) {
      this.filteredCandidates = this.candidates.filter((candidateList: any) => {
        return (
          candidateList.name.toLowerCase().indexOf(data.toLowerCase()) > -1
        );
      });
    } else {
      this.filteredCandidates = this.candidates;
    }
  }
}
