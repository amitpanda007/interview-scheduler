import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IInterview } from '../../admin/interview-card/interview';
import { Subject } from 'rxjs';
import { ICandidate } from '../../schedule/candidate';

@Injectable()
export class ScheduleService{
    private candidatesCollection: AngularFirestoreCollection<ICandidate>;
    private interviewDocument: AngularFirestoreDocument<IInterview>;
    private interview: IInterview;
    private candidates: ICandidate[];
    public interviewChanged = new Subject<IInterview>();
    public candidateChanged = new Subject<ICandidate[]>();

    constructor(private _store: AngularFirestore) {}

    fetchIntervewWithId(interviewId: string) {
        this.interviewDocument = this._store.collection("interviews").doc(interviewId);
        this.interviewDocument.valueChanges().subscribe(interview => {
            this.interview = interview;
            this.interviewChanged.next({...this.interview});
        });
    }

    fetchCandidatesOfInterview(interviewId: string) {
        this.candidatesCollection = this._store.collection("interviews").doc(interviewId).collection("candidates", (ref) => ref.orderBy("rank"));
        this.candidatesCollection.valueChanges({ idField: "id" }).subscribe(candidates => {
            this.candidates = candidates;
            this.candidateChanged.next([...this.candidates]);
        });
    }
}