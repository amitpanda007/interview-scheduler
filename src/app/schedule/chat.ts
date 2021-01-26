export interface IChat {
  id?: string;
  timestamp: Date;
  text: string;
  sender: string;
  senderType?: string;
}
