import { AfterViewInit, Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import {Router, RouterModule} from '@angular/router'
import { Injectable } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClient } from '@angular/common/http';
import { GlobalConstants } from '../globals';



@Component({
    selector: 'homescreen',
    templateUrl: './expression.component.html',
    styleUrls: ['./expression.component.css']
  })
  @Injectable()
  export class ExpressionComponent {
      standardExp: string[] = ["(baa|bb)", "(a|b)*", "(baa | bb)+ (a|b)*", "(a|b|c)*", "(baa | bb)+ (c)"]
      expression: string = "";
      
      // Variables for expression section
      config: Config = new Config();
      sizeHtml: number = 0;
      parsed: string = "";
      languageHtml: string = "";
      languageList: {position: number, word: string, length: number}[] = [];
      nonLanguageList: {position: number, word: string, length: number}[] = [];
      index: number = 0;

      // Variables for standard expression section
      standardConfig: Config = new Config();
      standardSizeHtml: number = 0;
      standardLanguageHtml: string = "";
      standardLanguageList: {position: number, word: string, length: number}[] = [];
      standardNonLanguageList: {position: number, word: string, length: number}[] = [];
      selectedOption: string = "";

      constructor(private http: HttpClient) {}

      
      
      getConfig(path: string) {
        // now returns an Observable of Config
        //this.path = "https://formalmethodapi.herokuapp.com/Network"
        return this.http.get<Config>(path);
      }

      getNetworkApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.config = {...data},
          error: (e: any) => console.error(e),
          complete: () =>this.showExpression() })
      }

      getStandardApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.standardConfig = {...data},
          error: (e: any) => console.error(e),
          complete: () =>this.showStandardExpression() })
      }

      showExpression(){
        this.nonLanguageList = [];
        this.sizeHtml = this.config.size;
        this.languageHtml = this.config.language.toString();
        this.languageList = [];
        this.config.language.forEach( (value) => {
          this.languageList.push({position: this.index, word: value, length: 1})
          this.index++;
        });
        this.index = 0;
        this.config.nonLanguage.forEach( (value) => {
          this.nonLanguageList.push({position: this.index, word: value, length: 1})
          this.index++;
        });
        this.index = 0;
      }

      showStandardExpression(){
        this.standardNonLanguageList = [];
        this.standardSizeHtml = this.standardConfig.size;
        this.standardLanguageHtml = this.standardConfig.language.toString();
        this.standardLanguageList = [];
        this.standardConfig.language.forEach( (value) => {
          this.standardLanguageList.push({position: this.index, word: value, length: 1})
          this.index++;
        });
        this.index = 0;
        this.standardConfig.nonLanguage.forEach( (value) => {
          this.standardNonLanguageList.push({position: this.index, word: value, length: 1})
          this.index++;
        });
        this.index = 0;
      }

      validateExpression(): boolean{
          return false;
      }

      getExpression(){
          this.parsed = this.expression.replaceAll("+", "@")
         this.getNetworkApiCall(GlobalConstants.path + "RegExp/" + this.parsed);
      }

      onChange(){
        var parsed = this.selectedOption.replaceAll("+", "@");
        this.getStandardApiCall(GlobalConstants.path + "RegExp/" + parsed);
      }

      
  }

  export class Config {
    message: string = "";
    size: number = 0;
    language: [] = [];
    expression: string = "";
    nonLanguage: [] = [];
  }

  class Expression{
    position: number = 0;
    word: string = "";
    length: number = 0;

    constructor(position: number, word: string, length: number){
      this.position = position;
      this.word = word;
      this.length = length;
    }
  }