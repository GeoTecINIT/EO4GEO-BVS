import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  private URL_BASE = 'https://findinbok.firebaseio.com/';
  private bokMap: Map<string, object>;
  private versionsMap: Map<string, string>;
  private currentVersion: string;

  constructor() {
    this.bokMap = new Map();
    this.versionsMap = new Map();
    const currentVersionUrl = 'current/version.json';
    this.getDataFromFirebase(currentVersionUrl).then((response) => {
      this.currentVersion = 'v' + response;
    });
  }

  async getBokVersion(version: string) {
    const queryVersion = version === this.currentVersion ? 'current' : version;
    if (!this.bokMap.has(queryVersion)){
      const bok = await this.getDataFromFirebase(queryVersion + '.json');
      this.bokMap.set(queryVersion, bok);
    }
    return this.bokMap.get(queryVersion);
  }

  async getOldVersionsData() {
    if(this.versionsMap.size === 0) {
      const versionsUrl = '.json?shallow=true';
      const versionsObject = await this.getDataFromFirebase(versionsUrl);
      delete versionsObject[this.currentVersion];
      delete versionsObject['current'];
      const versionsArray = Object.keys(versionsObject);
      for(let key of versionsArray) {
        const dateUrl = `${key}/creationYear.json`;
        this.versionsMap.set(key, await this.getDataFromFirebase(dateUrl));
      }
    }
    return this.versionsMap;
  }

  private async getDataFromFirebase(url: string) {
    try {
      const response = await fetch(this.URL_BASE + url);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
    }
  }
}
