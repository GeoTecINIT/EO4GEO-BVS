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

import { HttpClientModule } from '@angular/common/http';
import { DocumentationComponent } from './documentation/documentation.component';
import { DataTablesModule } from 'angular-datatables';
import { ModalModule } from 'ngx-bootstrap';
import { ReleaseNotesComponent } from './ui/release-notes/release-notes.component';
import {
  AppFooterModule,
  AppSidebarModule
} from '@coreui/angular';

@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    HeaderComponent,
    FooterComponent,
    ReleaseNotesComponent,
    TruncatePipe,
    HighlightPipe,
    DocumentationComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DataTablesModule,
    AppFooterModule,
    AppSidebarModule,
    ModalModule.forRoot(),
      ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [LayoutComponent]
})
export class AppModule { }
