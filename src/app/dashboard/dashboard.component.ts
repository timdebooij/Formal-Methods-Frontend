import { Component, Input } from '@angular/core';
import {Router, RouterModule} from '@angular/router'
import { Injectable } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../globals';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.css']
  })
  @Injectable()
  export class DashboardComponent {

    constructor(private http: HttpClient) {}
    config: Config = new Config();

    Reset(){
      this.getResetApiCall(GlobalConstants.path + "Network/reset");
    }

    getConfig(path: string) {
      return this.http.get<Config>(path);
    }

    getResetApiCall(path: string){
      this.getConfig(path).subscribe({next: (data: Config) => this.config = {...data},
        error: (e: any) => console.error(e) })
    }
  }

  export class Config {
    message: string = "";
    size: number = 0;
    language: [] = [];
    expression: string = "";
    nonLanguage: [] = [];
  }
