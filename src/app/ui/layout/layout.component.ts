import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';
import * as bok from '@eo4geo/bok-dataviz';
import { ActivatedRoute } from '@angular/router';

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

  searchCode = true;
  searchName = true;
  searchDes = true;
  searchSkills = false;

  @ViewChild('currentDescription') curentDescriptionText: ElementRef;
  @ViewChild('searchWhatFieldSn') searchWhatFieldSn: ElementRef;

  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
    bok.visualizeBOKData('#bubbles', 'assets/json/eo4geoBOKv6.json', '#textBoK');

    setTimeout(() => {
      const id = this.route.snapshot.paramMap.get('conceptId');
      if (id != null) {
        bok.browseToConcept(id);
      }
    }, 1000);
  }

  onChangeSearchText() {
    this.currentConcept = null;
    if (this.searchText.length >= 2) {
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
    if (this.searchText.length > 2 && this.currentConcept) { // Volver a resultados
      this.results = this.selectedNodes.length > 0;
      this.currentConcept = null;
      bok.browseToConcept('GIST');
    } else {
      this.currentConcept = key;
      this.results = null;
      bok.browseToConcept(key);
      if (this.searchText.length > 2) {
        setTimeout(() => {
          const text = new HighlightPipe().transform(document.getElementById('currentDescription').innerHTML, this.searchText);
          document.getElementById('currentDescription').innerHTML = text;
        }, 1000);
      }
    }
  }
}
