import {Component, ElementRef, HostListener, OnInit, ViewChild} from '@angular/core';
import * as bok from '@eo4geo/find-in-bok-dataviz';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ModalOptions} from 'ngx-bootstrap';
import { environment } from 'src/environments/environment';
import { timeout } from 'd3';

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

  limitSearchFrom = 0;
  limitSearchTo = 8;
  numberResultsShown = 8;
  isCopied = false;

  observer: MutationObserver;
  lastBoKTitle = '';

  searchInputField = '';

  loading = false;

  @ViewChild('currentDescription') curentDescriptionText: ElementRef;
  @ViewChild('searchWhatFieldSn') searchWhatFieldSn: ElementRef;
  @ViewChild('textInfo') textInfo: ElementRef;
  @ViewChild('releaseNotesModal') public releaseNotesModal: any;

  constructor(private route: ActivatedRoute, private http: HttpClient) { }
  ngOnInit() {
    this.setUpD3();
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
    this.observer.observe(this.textInfo.nativeElement, config);

  }

  private async setUpD3() {
    let id = this.route.snapshot.paramMap.get('conceptId');
    if (id === 'release-notes') {
      this.releaseNotesModal.basicModal.config = {backdrop: true, keyboard: true};
      this.releaseNotesModal.basicModal.show({});
      id = 'GIST';
    }
    const inputObject = {
      svgId: '#bubbles',
      textId: '#textInfo',
      urls: environment.URL_ARRAY,
      conceptId: id,
      versions: true,
      updateUrl: true,
    };

    this.loading = true;
    bok.visualizeBOKData(inputObject);
    setTimeout(() => {
      this.loading = false;
    }, 3000)
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
}
