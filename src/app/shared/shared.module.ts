import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {
  MatSnackBarModule,
  MatButtonModule,
  MatCardModule,
  MatToolbarModule,
  MatDialogModule,
  MatFormFieldModule,
  MatInputModule,
  MatMenuModule,
  MatBadgeModule,
  MatProgressSpinnerModule,
  MatSlideToggleModule,
  MatExpansionModule,
  MatIconModule,
  MatPaginatorModule,
  MatTabsModule,
  MatProgressBarModule,
  MatChipsModule,
  MatTooltipModule,
  MatCheckboxModule,
} from "@angular/material";

import { CapitalizePipe } from "./capitalize.pipe";
import { DefaultPipe } from "./default.pipe";

@NgModule({
  imports: [CommonModule, FormsModule],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CapitalizePipe,
    DefaultPipe,
    MatSnackBarModule,
    MatButtonModule,
    MatCardModule,
    MatToolbarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatMenuModule,
    MatBadgeModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatExpansionModule,
    MatIconModule,
    MatPaginatorModule,
    MatTabsModule,
    MatProgressBarModule,
    MatChipsModule,
    MatTooltipModule,
    MatCheckboxModule,
  ],
  declarations: [CapitalizePipe, DefaultPipe],
})
export class SharedModule {}
