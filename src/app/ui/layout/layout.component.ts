import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as bok from '@eo4geo/find-in-bok-dataviz';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {ModalOptions} from 'ngx-bootstrap';
import { FirebaseService } from 'src/app/service/firebase.service';

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

  @ViewChild('currentDescription') curentDescriptionText: ElementRef;
  @ViewChild('searchWhatFieldSn') searchWhatFieldSn: ElementRef;
  @ViewChild('textBoK') textBoK: ElementRef;
  @ViewChild('releaseNotesModal') public releaseNotesModal: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private firebaseService: FirebaseService) { }
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
    this.observer.observe(this.textBoK.nativeElement, config);

  }

  private async setUpD3() {
    let id = this.route.snapshot.paramMap.get('conceptId');
    if (id === 'release-notes') {
      this.releaseNotesModal.basicModal.config = {backdrop: true, keyboard: true};
      this.releaseNotesModal.basicModal.show({});
      id = 'GIST';
    }
    let found = false;
    let cVersion = 0;
    let yearVersion = '';
    const data = await this.firebaseService.getBokVersion('current');
    const versionsData = await this.firebaseService.getOldVersionsData();
    if (id != null) {
      cVersion = data['version'];
      yearVersion = data['updateDate'];
      this.currentVersion = cVersion;
      this.currentYear = yearVersion;
      Object.keys(data['concepts']).forEach(currentBok => {
        if (data['concepts'][currentBok].code === id && !found) {
          bok.visualizeBOKData('#bubbles', '#textBoK', data, versionsData, cVersion, this.currentVersion, this.currentYear, false, false);
          setTimeout(() => {
            if (id !== "" && id !== "GIST") bok.browseToConcept(id);
          }, 1000);
          found = true;
        }
      });
      if (!found) {
        await this.searchInOldBok(id, cVersion);
      }
    } else {
      cVersion = data['version'];
      yearVersion = data['updateDate'];
      bok.visualizeBOKData('#bubbles', '#textBoK', data, versionsData, cVersion, this.currentVersion, this.currentYear, false, false);
    }
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

  async searchInOldBok(code: string, version: number) {
    let foundInOld = false;
    const oldVersion = version - 1;
    let yearVersion = '';
    const data = await this.firebaseService.getBokVersion('current');
    const versionsData = await this.firebaseService.getOldVersionsData();
    if (data) {
      yearVersion = data['creationYear'];
      Object.keys(data['concepts']).forEach(oldBokKey => {
        if (data['concepts'][oldBokKey].code === code) {
          bok.visualizeBOKData('#bubbles', '#textBoK', data, versionsData, version, this.currentVersion, this.currentYear, yearVersion, true, false);
          setTimeout(() => {
            if (code !== "" && code !== "GIST") bok.browseToConcept(code);
          }, 1000);
          foundInOld = true;
        }
      });
      if (!foundInOld) {
        await this.searchInOldBok(code, oldVersion);
      }
    }
  }
}
