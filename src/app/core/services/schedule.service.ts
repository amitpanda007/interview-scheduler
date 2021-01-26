import { Injectable } from "@angular/core";
import {
  AngularFirestore,
  AngularFirestoreDocument,
  AngularFirestoreCollection,
  AngularFirestoreCollectionGroup,
} from "@angular/fire/firestore";
import { IInterview } from "../../admin/interview-card/interview";
import { Subject } from "rxjs";
import { ICandidate } from "../../schedule/candidate";
import { IChat } from "src/app/schedule/chat";

@Injectable()
export class ScheduleService {
  private candidatesCollection: AngularFirestoreCollection<ICandidate>;
  private interviewDocument: AngularFirestoreDocument<IInterview>;
  private chatCollection: AngularFirestoreCollection<IChat>;
  private interview: IInterview;
  private candidates: ICandidate[];
  private chats: IChat[];
  public interviewChanged = new Subject<IInterview>();
  public candidateChanged = new Subject<ICandidate[]>();
  public chatChanged = new Subject<IChat[]>();

  constructor(private _store: AngularFirestore) {}

  fetchIntervewWithId(interviewId: string) {
    this.interviewDocument = this._store
      .collection("interviews")
      .doc(interviewId);
    this.interviewDocument.valueChanges().subscribe((interview) => {
      this.interview = interview;
      this.interviewChanged.next({ ...this.interview });
    });
  }

  fetchCandidatesOfInterview(interviewId: string) {
    this.candidatesCollection = this._store
      .collection("interviews")
      .doc(interviewId)
      .collection("candidates", (ref) => ref.orderBy("rank"));
    this.candidatesCollection
      .valueChanges({ idField: "id" })
      .subscribe((candidates) => {
        this.candidates = candidates;
        this.candidateChanged.next([...this.candidates]);
      });
  }

  setChatMessage(interviewId: string, chat: IChat) {
    return this._store
      .collection("interviews")
      .doc(interviewId)
      .collection("chats")
      .add(chat);
  }

  fetchChatMessage(interviewId: string) {
    this.chatCollection = this._store
      .collection("interviews")
      .doc(interviewId)
      .collection("chats", (ref) => ref.orderBy("timestamp"));
    this.chatCollection.valueChanges({ idField: "id" }).subscribe((chats) => {
      this.chats = chats;
      this.chatChanged.next([...this.chats]);
    });
  }
}
