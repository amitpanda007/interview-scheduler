import { Injectable } from "@angular/core";
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { IInterview } from '../../admin/interview-card/interview';
import { Observable, Subject } from 'rxjs';
import { ICandidate } from '../../schedule/candidate';

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
        this.interviewCollection = this._store.collection<IInterview>(adminId, (ref) => ref.orderBy("date"));
        this.interviewCollection
            .valueChanges({ idField: "id" })
            .subscribe(interviews => {
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
                this.interview.id = interviewId;
                this.interviewChanged.next({...this.interview});
            });
    }

    fetchCandidates(adminId: string, interviewId) {
        this.candidateCollection = this._store.collection(adminId)
                                        .doc(interviewId)
                                        .collection("candidates", (ref) => ref.orderBy("rank"));
        this.candidateCollection
            .valueChanges({ idField: "id" })
            .subscribe((candidates) => {
                this.candidatesOfInterview = candidates;
                this.candidateChanged.next([...this.candidatesOfInterview]);
            });
    }

    setCandidateCompleteStatus(adminId: string, candidateId: string, status: boolean) {
        return this._store.firestore
            .runTransaction(() => {
                return Promise.all([
                    this._store
                        .collection(adminId)
                        .doc(this.interview.id)
                        .collection("candidates")
                        .doc(candidateId)
                        .set({ done: status }, { merge: true }),
                    this._store
                        .collection("interviews")
                        .doc(this.interview.id)
                        .collection("candidates")
                        .doc(candidateId)
                        .set({ done: status }, { merge: true }),
            ]);
        });
    }

    setInterviewLiveStatus(adminId: string, interviewId: string, status: boolean) {
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

}