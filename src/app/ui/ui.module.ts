import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout/layout.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from './layout/truncate.pipe';
import { HighlightPipe } from './layout/highlight.pipe';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
  ],
  declarations: [LayoutComponent, HeaderComponent, FooterComponent, TruncatePipe, HighlightPipe],
  exports: [LayoutComponent]
})
export class UiModule { }
