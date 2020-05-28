import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import * as bok from '@eo4geo/find-in-bok-dataviz';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  searchText = '';
  selectedNodes = [];
  results = false;
  limitSearch = 5;
  currentConcept = null;
  detail = false;
  searchCode = true;
  searchName = true;
  searchDes = true;
  searchSkills = false;
  conceptBase = '';
  currentVersion = 0;
  currentYear = '';
  private URL_BASE = 'https://findinbok-release.firebaseio.com/';

  @ViewChild('currentDescription') curentDescriptionText: ElementRef;
  @ViewChild('searchWhatFieldSn') searchWhatFieldSn: ElementRef;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }
  ngOnInit() {

      const id = this.route.snapshot.paramMap.get('conceptId');
      let found = false;
      let cVersion = 0;
      let yearVersion = '';
      if (id != null) {
        this.http.get(this.URL_BASE + 'current.json')
          .subscribe(data => {
            cVersion = data['version'];
            yearVersion = data['updateDate'];
            this.currentVersion = cVersion;
            this.currentYear = yearVersion;
            Object.keys(data['concepts']).forEach( currentBok => {
              if (data['concepts'][currentBok].code === id && !found ) {
                bok.visualizeBOKData('#bubbles', this.URL_BASE , '#textBoK', cVersion, null, null, yearVersion, null);
                setTimeout ( () => {
                  bok.browseToConcept(id);
                }, 1000);
                found = true;
              }
            });
            if (!found) {
              this.searchInOldBok(id, cVersion);
            }
          });
      } else {
        this.http.get(this.URL_BASE + 'current.json')
          .subscribe(data => {
            cVersion = data['version'];
            yearVersion = data['updateDate'];
            bok.visualizeBOKData('#bubbles', this.URL_BASE , '#textBoK', cVersion, null, null, yearVersion, null );
          });
      }
  }

  onChangeSearchText() {
    this.currentConcept = null;
    this.conceptBase = window.location.pathname.split('/')[1];
    if (this.searchText.length >= 2) {
      this.detail = false;
      this.selectedNodes = bok.searchInBoK(this.searchText, this.searchCode, this.searchName, this.searchDes, this.searchSkills);
      this.results = this.selectedNodes.length > 0;
    } else {
      this.selectedNodes = [];
      this.results = false;
      bok.cleanSearchInBOK();
    }
  }

  incrementLimit() {
    this.limitSearch = this.limitSearch + 5;
  }

  navigateToConcept(key) {
    if (this.searchText.length > 2 && this.currentConcept) {
      this.results = this.selectedNodes.length > 0;
      this.currentConcept = null;
      bok.browseToConcept('GIST');
    } else if (key === 'goBack') {
      this.searchText = '';
      this.detail = false;
      this.results = null;
      bok.browseToConcept(this.conceptBase);
      bok.cleanSearchInBOK();
    } else {
      this.currentConcept = key;
      this.results = null;
      this.detail = true;
      bok.browseToConcept(key);
      if (this.searchText.length > 2) {
        setTimeout(() => {
          const text = new HighlightPipe().transform(document.getElementById('currentDescription').innerHTML, this.searchText);
          document.getElementById('currentDescription').innerHTML = text;
        }, 1000);
      }
    }
  }

  searchInOldBok(code, version) {
    let foundInOld = false;
    const oldVersion = version - 1;
    let yearVersion = '';
    this.http.get(this.URL_BASE + 'v' + oldVersion  + '.json')
      .subscribe(data => {
        yearVersion = data['creationYear'];
        Object.keys(data['concepts']).forEach( oldBokKey => {
          if (data['concepts'][oldBokKey].code === code) {
            bok.visualizeBOKData('#bubbles', this.URL_BASE, '#textBoK', this.currentVersion, oldVersion,
              'red', this.currentYear, yearVersion);
            setTimeout ( () => {
              bok.browseToConcept(code);
            }, 1000);
            foundInOld = true;
          }
        });
        if (!foundInOld) {
          this.searchInOldBok(code, oldVersion);
        }
      });
  }
}
