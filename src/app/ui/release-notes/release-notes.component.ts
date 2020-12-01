import { Component, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-release-notes',
  templateUrl: './release-notes.component.html',
  styleUrls: ['./release-notes.component.scss']
})
export class ReleaseNotesComponent implements OnInit {

  @ViewChild('releaseModal') basicModal: ModalDirective;

  constructor() {}

  ngOnInit(): void {
  }

  // open modal
  open(): void {
    this.basicModal.show();
  }

  // close modal
  close(): void {
    this.basicModal.hide();
  }

}
