import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as bok from '@eo4geo/find-in-bok-dataviz';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ModalOptions} from 'ngx-bootstrap';

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
  currentConcept = 'GIST';
  detail = false;
  searchCode = true;
  searchName = true;
  searchDes = true;
  searchSkills = false;
  conceptBase = '';
  currentVersion = 0;
  currentYear = '';
  private URL_BASE = 'https://eo4geo-uji-backup.firebaseio.com/';

  limitSearchFrom = 0;
  limitSearchTo = 8;
  numberResultsShown = 8;
  isCopied = false;

  observer: MutationObserver;
  lastBoKTitle = '';

  searchInputField = '';

  @ViewChild('currentDescription') curentDescriptionText: ElementRef;
  @ViewChild('searchWhatFieldSn') searchWhatFieldSn: ElementRef;
  @ViewChild('textBoK') textBoK: ElementRef;
  @ViewChild('releaseNotesModal') public releaseNotesModal: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }
  ngOnInit() {


    let id = this.route.snapshot.paramMap.get('conceptId');
    console.log('El id!!! ', id);
    if (id === 'release-notes') {
      this.releaseNotesModal.basicModal.config = {backdrop: true, keyboard: true};
      this.releaseNotesModal.basicModal.show({});
      id = 'GIST';
    }
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
          Object.keys(data['concepts']).forEach(currentBok => {
            if (data['concepts'][currentBok].code === id && !found) {
              bok.visualizeBOKData('#bubbles', this.URL_BASE, '#textBoK', cVersion, null, null, yearVersion, null);
              setTimeout(() => {
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
          bok.visualizeBOKData('#bubbles', this.URL_BASE, '#textBoK', cVersion, null, null, yearVersion, null);
        });
    }

    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if ((<any>mutation.target).children[1].innerText !== this.lastBoKTitle) {
          this.lastBoKTitle = (<any>mutation.target).children[1].innerText;
          this.results = false;
          this.isCopied = false;
        }
      });
    });

    const config = { attributes: true, childList: true, characterData: true };
    this.observer.observe(this.textBoK.nativeElement, config);

  }

  onChangeSearchText() {

    this.currentConcept = '';
    this.isCopied = false;
    this.conceptBase = window.location.pathname.split('/')[1];
    if (this.searchText.length >= 2) {
      this.detail = false;
      this.selectedNodes = bok.searchInBoK(this.searchText, this.searchCode, this.searchName, this.searchDes, this.searchSkills);
      this.results = this.selectedNodes.length > 0;
      this.limitSearchTo = this.numberResultsShown;
      this.limitSearchFrom = 0;
    } else {
      this.selectedNodes = [];
      this.results = false;
      bok.cleanSearchInBOK();
    }
  }

  copyHTML() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    const code = this.lastBoKTitle.split(']')[0].slice(1);
    selBox.value = '<a target="_blank" href="https://bok.eo4geo.eu/' + code  + '"> ' + this.lastBoKTitle + '  </a>';
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    selBox.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.isCopied = true;
  }

  copyPermalink() {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    const code = this.lastBoKTitle.split(']')[0].slice(1);
    selBox.value = 'https://bok.eo4geo.eu/' + code;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    selBox.setSelectionRange(0, 99999);
    document.execCommand('copy');
    document.body.removeChild(selBox);
    this.isCopied = true;
  }

  cleanResults() {
    this.searchInputField = '';
    this.searchText = '';
    bok.searchInBoK('');
    this.navigateToConcept('GIST');
    this.isCopied = false;
  }

  incrementLimit() {
    this.limitSearchTo = this.limitSearchTo + this.numberResultsShown;
    this.limitSearchFrom = this.limitSearchFrom + this.numberResultsShown;
  }

  decrementLimit() {
    this.limitSearchTo = this.limitSearchTo - this.numberResultsShown;
    this.limitSearchFrom = this.limitSearchFrom - this.numberResultsShown;
  }


  navigateToConcept(conceptName) {
    bok.browseToConcept(conceptName);
    this.currentConcept = conceptName;
    this.results = false;
    console.log('Navigate to concept :' + conceptName);
  }

  searchInOldBok(code, version) {
    let foundInOld = false;
    const oldVersion = version - 1;
    let yearVersion = '';
    this.http.get(this.URL_BASE + 'v' + oldVersion + '.json')
      .subscribe(data => {
        if (data) {
          yearVersion = data['creationYear'];
          Object.keys(data['concepts']).forEach(oldBokKey => {
            if (data['concepts'][oldBokKey].code === code) {
              bok.visualizeBOKData('#bubbles', this.URL_BASE, '#textBoK', this.currentVersion, oldVersion,
                'red', this.currentYear, yearVersion);
              setTimeout(() => {
                bok.browseToConcept(code);
              }, 1000);
              foundInOld = true;
            }
          });
          if (!foundInOld) {
            this.searchInOldBok(code, oldVersion);
          }
        }
      });
  }
}
