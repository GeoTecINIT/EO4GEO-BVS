import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HighlightPipe } from './highlight.pipe';


declare function searchInBoK(): any;
declare function cleanSearchInBOK(): any;
declare function browseToConcept(string): any;


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

  @ViewChild('currentDescription') curentDescriptionText: ElementRef;

  constructor() { }
  ngOnInit() {
  }

  onChangeSearchText() {
    this.currentConcept = null;
    if (this.searchText.length > 2) {
      this.selectedNodes = searchInBoK();
      this.results = this.selectedNodes.length > 0;
    } else {
      this.selectedNodes = [];
      this.results = false;
      cleanSearchInBOK();
    }
    console.log('RESULTS: ' + this.results);
  }

  incrementLimit() {
    this.limitSearch = this.limitSearch + 5;
  }

  navigateToConcept(key) {
    if (this.searchText.length > 2 && this.currentConcept) { // Volver a resultados
      // this.selectedNodes = searchInBoK();
      this.results = this.selectedNodes.length > 0;
      this.currentConcept = null;
      browseToConcept('GIST');
    } else {
      console.log('NAVIGATING TO: ' + key);
      this.currentConcept = key;
      this.results = null;

      if (this.searchText.length > 2) {
        setTimeout(() => {
          const text = new HighlightPipe().transform(document.getElementById('currentDescription').innerHTML, this.searchText);
          document.getElementById('currentDescription').innerHTML = text;
          const textAccordion = new HighlightPipe().transform(document.getElementById('accordion').innerHTML, this.searchText);
          document.getElementById('accordion').innerHTML = textAccordion;
        }, 1000);
      }
      browseToConcept(key);

    }
  }
}
