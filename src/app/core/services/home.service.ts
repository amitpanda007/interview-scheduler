import { Injectable } from "@angular/core";
import { AngularFirestore } from "@angular/fire/firestore";
import { Router } from "@angular/router";

@Injectable()
export class HomeService {
  constructor(private store: AngularFirestore, private router: Router) {}

  getInterviewFromFirebase(interviewId: string) {
    const interviewDoc = this.store
      .collection("interviews")
      .doc(interviewId)
      .get();

    return interviewDoc;
  }

  navigateToInterview(id: string) {
    this.router.navigate([`/interview/${id}`]);
  }
}
