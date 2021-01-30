import { firestore } from 'firebase';

export class IInterview {
  id?: string;
  name: string;
  date: firestore.Timestamp;
  startTime: string;
  live?: boolean;
  candidates?: number;
  chat?: boolean;
  privacy?: boolean;
}
