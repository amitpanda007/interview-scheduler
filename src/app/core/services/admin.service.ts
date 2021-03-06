import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from "@angular/fire/firestore";
import { IInterview } from "../../admin/interview-card/interview";
import { Observable, Subject } from "rxjs";
import { ICandidate } from "../../schedule/candidate";

@Injectable()
export class AdminService {
  private interviewCollection: AngularFirestoreCollection<IInterview>;
  private candidateCollection: AngularFirestoreCollection<ICandidate>;
  private allInterviews: IInterview[];
  private candidatesOfInterview: ICandidate[];
  private interview: IInterview;
  public interviewsChanged = new Subject<IInterview[]>();
  public interviewChanged = new Subject<IInterview>();
  public candidateChanged = new Subject<ICandidate[]>();

  constructor(private _store: AngularFirestore) {}

  fetchInterviews(adminId: string) {
    this.interviewCollection = this._store.collection<IInterview>(
      adminId,
      (ref) => ref.orderBy("date")
    );
    this.interviewCollection
      .valueChanges({ idField: "id" })
      .subscribe((interviews) => {
        this.allInterviews = interviews;
        this.interviewsChanged.next([...this.allInterviews]);
      });
  }

  addInterviewDoc(adminId: string, interview: IInterview) {
    return this._store.firestore.runTransaction(async () => {
      const docInfo = await this._store.collection(adminId).add(interview);
      await this._store.collection("interviews").doc(docInfo.id).set(interview);
    });
  }

  fetchInterview(adminId: string, interviewId: string) {
    this._store
      .collection(adminId)
      .doc(interviewId)
      .valueChanges()
      .subscribe((interview: IInterview) => {
        this.interview = interview;
        // this.interview.id = interviewId;
        this.interviewChanged.next({ ...this.interview });
      });
  }

  fetchCandidates(adminId: string, interviewId: string) {
    this.candidateCollection = this._store
      .collection(adminId)
      .doc(interviewId)
      .collection("candidates", (ref) => ref.orderBy("rank"));
    this.candidateCollection
      .valueChanges({ idField: "id" })
      .subscribe((candidates) => {
        this.candidatesOfInterview = candidates;
        this.candidateChanged.next([...this.candidatesOfInterview]);
      });
  }

  fetchCandidateCount(adminId: string, interviewId: string) {
    return this._store
      .collection(adminId)
      .doc(interviewId)
      .collection("candidates").get();
  }

  setCandidateCompleteStatus(
    adminId: string,
    interviewId: string,
    candidateId: string,
    status: boolean
  ) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store
          .collection(adminId)
          .doc(interviewId)
          .collection("candidates")
          .doc(candidateId)
          .set({ done: status }, { merge: true }),
        this._store
          .collection("interviews")
          .doc(interviewId)
          .collection("candidates")
          .doc(candidateId)
          .set({ done: status }, { merge: true }),
      ]);
    });
  }

  setInterviewLiveStatus(
    adminId: string,
    interviewId: string,
    status: boolean
  ) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store
          .collection(adminId)
          .doc(interviewId)
          .set({ live: status }, { merge: true }),
        this._store
          .collection("interviews")
          .doc(interviewId)
          .set({ live: status }, { merge: true }),
      ]);
    });
  }

  setInterviewPrivacyStatus(
    adminId: string,
    interviewId: string,
    status: boolean
  ) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store
          .collection(adminId)
          .doc(interviewId)
          .set({ privacy: status }, { merge: true }),
        this._store
          .collection("interviews")
          .doc(interviewId)
          .set({ privacy: status }, { merge: true }),
      ]);
    });
  }

  setInterviewChatStatus(
    adminId: string,
    interviewId: string,
    status: boolean
  ) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store
          .collection(adminId)
          .doc(interviewId)
          .set({ chat: status }, { merge: true }),
        this._store
          .collection("interviews")
          .doc(interviewId)
          .set({ chat: status }, { merge: true }),
      ]);
    });
  }

  deleteInterview(adminId: string, interviewId: string) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store.collection("interviews").doc(interviewId).delete(),
        this._store.collection(adminId).doc(interviewId).delete(),
      ]);
    });
  }

  updateInterview(adminId: string, interview: IInterview) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store.collection(adminId).doc(interview.id).update(interview),
        this._store
          .collection("interviews")
          .doc(interview.id)
          .update(interview),
      ]);
    });
  }

  updateCandidate(
    adminId: string,
    interviewId: string,
    candidateId: string,
    candidateData: ICandidate
  ) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store
          .collection(adminId)
          .doc(interviewId)
          .collection("candidates")
          .doc(candidateId)
          .update(candidateData),
        this._store
          .collection("interviews")
          .doc(interviewId)
          .collection("candidates")
          .doc(candidateId)
          .update(candidateData),
      ]);
    });
  }

  deleteCandidate(
    adminId: string,
    interviewId: string,
    candidateDocId: string
  ) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store
          .collection(adminId)
          .doc(interviewId)
          .collection("candidates")
          .doc(candidateDocId)
          .delete(),
        this._store
          .collection("interviews")
          .doc(interviewId)
          .collection("candidates")
          .doc(candidateDocId)
          .delete(),
      ]);
      //Set total candidate to interview collection
      // await this._store
      //   .collection(adminId)
      //   .doc(interviewId)
      //   .get()
      //   .subscribe((interview) => {
      //     const curInterview = interview.data();
      //     this._store
      //       .collection(adminId)
      //       .doc(interviewId)
      //       .set({ candidates: curInterview.candidates - 1 }, { merge: true });
      //     this._store
      //       .collection("interviews")
      //       .doc(interviewId)
      //       .set({ candidates: curInterview.candidates - 1 }, { merge: true });
      //   });
    });
  }

  deleteAllCandidates(
    adminId: string,
    interviewId: string,
    candidateDocIds: string[]
  ) {
    candidateDocIds.forEach((candidateDocId) => {
      this._store.firestore.runTransaction(() => {
        return Promise.all([
          this._store
            .collection(adminId)
            .doc(interviewId)
            .collection("candidates")
            .doc(candidateDocId)
            .delete(),
          this._store
            .collection("interviews")
            .doc(interviewId)
            .collection("candidates")
            .doc(candidateDocId)
            .delete(),
        ]);
      });
    });
    return Promise.resolve();
  }

  addCandidate(adminId: string, interviewId: string, candidate: ICandidate) {
    return this._store.firestore.runTransaction(async () => {
      //Add candidate to candidates collection
      const candidateDoc = await this._store
        .collection(adminId)
        .doc(interviewId)
        .collection("candidates")
        .add(candidate);
      await this._store
        .collection("interviews")
        .doc(interviewId)
        .collection("candidates")
        .doc(candidateDoc.id)
        .set(candidate);
      //Set total candidate to interview collection
      /*
      Removed this to handle this on UI side
      */
      // await this._store
      //   .collection(adminId)
      //   .doc(interviewId)
      //   .get()
      //   .subscribe((interview) => {
      //     const curInterview = interview.data();
      //     let candidateCount;
      //     curInterview.candidates
      //       ? (candidateCount = curInterview.candidates + 1)
      //       : (candidateCount = 1);
      //     this._store
      //       .collection(adminId)
      //       .doc(interviewId)
      //       .set({ candidates: candidateCount }, { merge: true });
      //     this._store
      //       .collection("interviews")
      //       .doc(interviewId)
      //       .set({ candidates: candidateCount }, { merge: true });
      //   });
    });
  }

  addBulkCandidates(
    adminId: string,
    interviewId: string,
    candidates: ICandidate[]
  ) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        candidates.forEach(async (candidate) => {
          const candidateDoc = await this._store
            .collection(adminId)
            .doc(interviewId)
            .collection("candidates")
            .add(candidate);
          await this._store
            .collection("interviews")
            .doc(interviewId)
            .collection("candidates")
            .doc(candidateDoc.id)
            .set(candidate);
        }),
      ]);
    });
  }

  setCandidateDelay(
    adminId: string,
    interviewId: string,
    candidateId: string,
    delay: number
  ) {
    return this._store.firestore.runTransaction(() => {
      return Promise.all([
        this._store
          .collection(adminId)
          .doc(interviewId)
          .collection("candidates")
          .doc(candidateId)
          .set({ delay: delay }, { merge: true }),
        this._store
          .collection("interviews")
          .doc(interviewId)
          .collection("candidates")
          .doc(candidateId)
          .set({ delay: delay }, { merge: true }),
      ]);
    });
  }
}
