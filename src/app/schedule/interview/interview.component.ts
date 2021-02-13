import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { Subscription } from "rxjs";
import { ScheduleService } from "../../core/services/schedule.service";
import { IInterview } from "../../admin/interview-card/interview";
import { IChat } from "../chat";

@Component({
  selector: "interview",
  templateUrl: "interview.component.html",
  styleUrls: ["interview.component.scss"],
})
export class InterviewComponent implements OnInit, OnDestroy {
  public interviewId: string;
  public candidateId: string;
  public chatText: string;
  public openChatWindow: boolean;
  public interview: IInterview;
  public chats: IChat[];
  public isLoading: boolean;
  public remainingTime;
  private interviewsSubscription: Subscription;
  private chatSubscription: Subscription;

  constructor(
    private route: ActivatedRoute,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.openChatWindow = true;
    this.interviewId = this.route.snapshot.paramMap.get("interviewId");
    this.candidateId = this.route.snapshot.paramMap.get("candidateId");
    this.scheduleService.fetchIntervewWithId(this.interviewId);
    this.interviewsSubscription = this.scheduleService.interviewChanged.subscribe(
      (interview) => {
        this.interview = interview;
        this.isLoading = false;
        this.calculateRemainingTime();
      }
    );

    this.scheduleService.fetchChatMessage(this.interviewId);
    this.chatSubscription = this.scheduleService.chatChanged.subscribe(
      (chats) => {
        console.log(chats);
        for (let chat of chats) {
          if (chat.sender == this.candidateId) {
            chat.senderType = "me";
          } else {
            chat.senderType = "them";
          }
        }
        this.chats = chats;
      }
    );
  }

  ngOnDestroy(): void {
    this.interviewsSubscription.unsubscribe();
    this.chatSubscription.unsubscribe();
  }

  calculateRemainingTime() {
    const todayDate = new Date();
    const interviewDate = this.interview.date.toDate();

    const diffTime = interviewDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    this.remainingTime = diffDays + " days";
    console.log(diffDays);
    if (diffDays == 0) {
      this.remainingTime = "tomorrow";
    } else if (diffDays < 0) {
      this.remainingTime = "old interview";
    }
  }

  sendChat() {
    if (this.chatText && this.chatText.trim().length > 0) {
      const chatData: IChat = {
        timestamp: new Date(),
        text: this.chatText,
        sender: this.candidateId,
      };
      this.scheduleService
        .setChatMessage(this.interviewId, chatData)
        .then((_) => {
          console.log("Chat Sent.");
        })
        .catch((error) => {
          //TODO: handle error scenario
          console.log(error);
        });
      this.chatText = "";
    } else {
      this.chatText = "";
    }
  }

  showChat() {
    this.openChatWindow = !this.openChatWindow;
  }
}
