import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { LayoutComponent } from './ui/layout/layout.component';
import { HeaderComponent } from './ui/header/header.component';
import { FooterComponent } from './ui/footer/footer.component';
import { FormsModule } from '@angular/forms';
import { TruncatePipe } from './ui/layout/truncate.pipe';
import { HighlightPipe } from './ui/layout/highlight.pipe';


@NgModule({
  declarations: [
    AppComponent, LayoutComponent, HeaderComponent, FooterComponent, TruncatePipe, HighlightPipe],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [LayoutComponent]
})
export class AppModule { }
