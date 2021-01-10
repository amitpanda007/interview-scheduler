import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: "filter-candidates",
  template: `
    <input
      class="search-input"
      name="search"
      type="text"
      placeholder="search for your name"
      [(ngModel)]="filter"
      autocomplete="off"
    />
  `,
  styles: [
    `
      .search-input {
        -moz-box-shadow: 0 10px 35px rgba(0, 0, 0, 0.1);
        -webkit-appearance: none !important;
        -webkit-box-shadow: 0 10px 35px rgba(0, 0, 0, 0.1);
        background: #fff;
        border: 0;
        border-radius: 5px;
        box-shadow: 0 10px 35px rgba(0, 0, 0, 0.1);
        color: #6c757d;
        font-size: 1rem;
        height: 2rem;
        outline: none;
        padding: 1rem 1rem 1rem 3rem;
        // width: calc(100% - 4rem);
        width: 15rem;
      }
    `,
  ],
})
export class FilterCandidatesComponent implements OnInit {
  private _filter: string;
  @Input() get filter() {
    return this._filter;
  }

  set filter(val: string) {
    this._filter = val;
    this.changed.emit(this.filter);
  }

  @Output() changed: EventEmitter<string> = new EventEmitter<string>();

  constructor() {}

  ngOnInit() {}
}
