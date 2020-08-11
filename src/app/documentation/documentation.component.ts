import { Component, OnInit } from '@angular/core';
import { Http, Response } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

class Document {
  tool: string;
  name: string;
  url: string;
  date: string;
}

@Component({
  selector: 'app-documentation',
  templateUrl: './documentation.component.html',
  styleUrls: ['./documentation.component.scss']
})


export class DocumentationComponent implements OnInit {
  dtOptions: {};
  documents: any[];
  dtTrigger = new Subject();

  docusURL = 'https://firestore.googleapis.com/v1/projects/eo4geo-uji/databases/(default)/documents/Documentation';

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 50,
      responsive: true
    };

    const that = this;

    this.showDocs();
  }

  getDocs() {
    // now returns an Observable of Config
    return this.http.get(this.docusURL);
  }

  showDocs() {
    this.getDocs()
      .subscribe((res: any) => {
        // console.log(res);
        this.documents = [];
        if (res && res.documents) {
          res.documents.forEach(d => {
            // tslint:disable-next-line:max-line-length
            this.documents.push({ tool: d.fields.tool.stringValue, name: d.fields.name.stringValue, url: d.fields.url.stringValue, date: new Date(d.fields.date.timestampValue) });
          });
          this.dtTrigger.next();
        }
      });
  }
}
