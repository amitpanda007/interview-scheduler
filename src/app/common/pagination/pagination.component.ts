import {
  Component,
  OnInit,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from "@angular/core";
import { DomSanitizer } from "@angular/platform-browser";
import { MatIconRegistry } from "@angular/material/icon";

@Component({
  selector: "pagination",
  templateUrl: "pagination.component.html",
  styleUrls: ["pagination.component.scss"],
})
export class PaginationComponent implements OnInit, OnChanges {
  // @Input() data: Array<IMovies>;
  @Input() totalData: number;
  @Input() itemsPerPage: number;
  @Output() pageChange: EventEmitter<object> = new EventEmitter<object>();
  private totalItems: Array<Number>;
  private currentPage: number;
  private lastPage: number;

  // dataPerPage: number = 5;

  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIcon(
      "back",
      sanitizer.bypassSecurityTrustResourceUrl(
        "assets/image/icons/keyboard_arrow_left-24px.svg"
      )
    );

    iconRegistry.addSvgIcon(
      "next",
      sanitizer.bypassSecurityTrustResourceUrl(
        "assets/image/icons/keyboard_arrow_right-24px.svg"
      )
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["totalData"]) {
      if (changes["totalData"].currentValue) {
        this.totalItems = this.getPages(this.totalData);
        this.lastPage = this.totalItems.length;
      }
    }
  }

  ngOnInit() {
    this.currentPage = 1;
  }

  pageEvent(event) {
    console.log(event);
    console.log(this.currentPage);
    this.pageChange.emit({
      pageIndex: event.pageIndex,
      pageSize: event.pageSize,
    });
  }

  // paginate(event: any, page: string) {
  //   var target = event.target || event.srcElement || event.currentTarget;
  //   var idAttr = target.attributes.id;
  //   var value = idAttr.nodeValue;
  //   if (page == '-1') {
  //     if(this.currentPage > 1) {
  //       this.currentPage -= 1;
  //       this.pageChange.emit(this.currentPage);
  //       console.log("going to page "+ this.currentPage);
  //     }
  //     return;
  //   }
  //   if (page == '+1') {
  //     if(this.currentPage < this.lastPage) {
  //       this.currentPage += 1;
  //       this.pageChange.emit(this.currentPage);
  //       console.log("going to page " + this.currentPage);
  //     }
  //     return;
  //   }
  //   page = page + 1;
  //   console.log("going to page " + page);
  //   this.currentPage = parseInt(page);
  //   this.pageChange.emit(this.currentPage);
  // }

  getPages(_data) {
    console.log(_data);
    let totalPages = Math.ceil(_data / this.itemsPerPage);
    return [...Array(totalPages).keys()];
  }
}
