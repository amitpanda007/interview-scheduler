export class IInterview {
  id?: string;
  name: string;
  date: Date;
  startTime: string;
  live?: boolean;
  candidates?: number;
  chat?: boolean;
  privacy?: boolean;
}
