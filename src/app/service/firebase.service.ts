import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {

  private URL_BASE = 'https://eo4geo-uji-backup.firebaseio.com/';
  private bokMap: Map<string, undefined>;
  private versionsMap: Map<string, string>;
  private currentVersion: string;

  constructor() {
    this.bokMap = new Map();
    this.versionsMap = new Map();
    const currentVersionUrl = 'current/version.json';
    this.getDataFromFirebase(currentVersionUrl).then((response) => {
      this.currentVersion = 'v' + response;
      console.log(this.currentVersion);
    });
  }

  async getBokVersion(version: string) {
    if (!this.bokMap.has(version)){
      const bok = await this.getDataFromFirebase(version + '.json');
      this.bokMap.set(version, bok);
    }
    return this.bokMap.get(version);
  }

  async getVersionsData() {
    if(this.versionsMap.size === 0) {
      const versionsUrl = '.json?shallow=true';
      const versionsObject = await this.getDataFromFirebase(versionsUrl);
      const versionsArray = Object.keys(versionsObject);
      for(let key in versionsArray) {
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
