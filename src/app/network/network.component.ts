import { AfterViewInit, Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ViewChild, Inject } from '@angular/core';
import {Router, RouterModule} from '@angular/router'
import { Injectable } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClient } from '@angular/common/http';
import { EdgeModel } from '../models/EdgeModel';
import { NodeModel } from '../models/NodeModel';
import { DataSet } from 'vis-data';
import { Network, Edge } from 'vis-network';
import { DOCUMENT } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { GlobalConstants } from '../globals';


@Component({
    selector: 'homescreen',
    templateUrl: './network.component.html',
    styleUrls: ['./network.component.css']
  })
  @Injectable()
  export class NetworkComponent {
    @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
    @ViewChild('visExampleNetwork', { static: false }) visExampleNetwork!: ElementRef;
    private networkInstance: any;
    path = "";

    //Configs
    config: Config = new Config();
    exampleConfig: Config = new Config();
    wordCheck: wordCheck = new wordCheck();

    //Generator variables
    state: string = "";
    alphabet: string = "";
    letter: string = "";
    from: string = "";
    to: string = "";
    id: number = 0;
    newId: number = 0;

    //Example variables
    exampleId: number = 0;
    endState: string = "";
    startState: string = "";
    startString: string = "";
    contString: string = "";
    endString: string = "";
    constructId: number = 0;
    word: string = "";
    show: boolean = false;
    checkedWord: string = "";

    constructor(private http: HttpClient, @Inject(DOCUMENT) document: Document) {}
  ngOnInit(): void {
    //this.showConfig()
    this.getIds();
    
  }

  ngAfterViewInit(){

  }

    ngOnChanges(changes: SimpleChanges) {
        console.log(changes)
      }

      getIds(){
        this.getNetworkApiCall(GlobalConstants.path + "Network/id")
      }
     
      getNetwork(){
        this.getNetworkApiCall(GlobalConstants.path + "Network")
      }

      getNetworkBack(){
        this.getNetworkApiCall(GlobalConstants.path + "Network/" + this.id)
      }
    
      createNewNetwork(){
        console.log(this.alphabet)
        if(!(this.alphabet.match("") === null)){
          this.getNetworkApiCall(GlobalConstants.path + "Network/create/1/-")
        }
        this.getNetworkApiCall(GlobalConstants.path + "Network/create/" + this.newId + "/" + this.alphabet)
      }

      constructNetwork(){
        if(this.startString === ""){
          this.startString = "-";
        }
        if(this.contString === ""){
          this.contString = "-";
        }
        if(this.endString === ""){
          this.endString = "-";
        }
        this.getNetworkExampleApiCall(GlobalConstants.path + "Network/construct/" + this.constructId + "/" + this.startString + "/" + this.contString + "/" + this.endString)
      }
    
      addTransition(){
        this.getNetworkApiCall(GlobalConstants.path + "Network/add/" + this.id + "/" + this.from + "/" + this.letter + "/" + this.to)
      }

      addState(){
        this.getNetworkApiCall(GlobalConstants.path + "Network/addState/" + this.id + "/" + this.state)
      }
    
      setStartState(){
        this.getNetworkApiCall(GlobalConstants.path + "Network/start/" + this.id + "/" + this.startState)
      }
    
      setEndState(){
        this.getNetworkApiCall(GlobalConstants.path + "Network/end/" + this.id + "/" + this.endState)
      }
    
      getNetworkApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.config = {...data},
          error: (e: any) => console.error(e),
          complete: () =>this.buildNetwork() })
      }

      getNetworkExampleApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.exampleConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.buildExampleNetwork() })
      }

      getWordCheckApiCall(path: string){
        this.getWordCheck(path).subscribe({next: (data: wordCheck) => this.wordCheck = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.showWord()})
      }

      showWord(){
        this.show = true;
        this.checkedWord = this.wordCheck.word;
      }

      loadNetwork(){
        if(!(this.exampleId == 0)){
          this.getNetworkExampleApiCall(GlobalConstants.path + "Network/" + this.exampleId)
        }
      }

      checkWord(){
        this.getWordCheckApiCall(GlobalConstants.path + "Network/check/" + this.exampleId + "/" + this.word)
      }
      
      buildNetwork(){
        this.id = this.config.id;
        this.exampleId = this.config.ids[0];
        if(this.config.status == 200){
          this.from = this.config.states[0];
          this.letter = this.config.alphabet[0];
          this.to = this.config.states[0];
          this.startState = this.config.states[0];
          this.endState = this.config.states[0]
          const nodes = new DataSet<any>([])
          const edges = new DataSet<any>([])
      
          for(let i = 0; i < this.config.nodes.length; i++){
            nodes.add(this.config.nodes[i])
          }
          for(let j = 0; j < this.config.edges.length; j++){
            edges.add(this.config.edges[j])
          }
          const data = { nodes, edges };
  
          var options = {
            width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
            height: (310) + "px"
          };
       
          const container = this.visNetwork;
          this.networkInstance = new Network(container.nativeElement, data, options);
        }
        
      }

      buildExampleNetwork(){
        this.config.ids = this.exampleConfig.ids;
        if(this.exampleConfig.status == 200){
          const nodes = new DataSet<any>([])
          const edges = new DataSet<any>([])
      
          for(let i = 0; i < this.exampleConfig.nodes.length; i++){
            nodes.add(this.exampleConfig.nodes[i])
          }
          for(let j = 0; j < this.exampleConfig.edges.length; j++){
            edges.add(this.exampleConfig.edges[j])
          }
          const data = { nodes, edges };
  
          var options = {
            width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
            height: (310) + "px"
          };
       
          const container = this.visExampleNetwork;
          this.networkInstance = new Network(container.nativeElement, data, options);
        }
      }

      
      getConfig(path: string) {
        return this.http.get<Config>(path);
      }

      getWordCheck(path: string){
        return this.http.get<wordCheck>(path);
      }

      checkReturn(){
        if(this.config.status == 200){
          return false;
        }
        else{
          return true;
        }

      }

      checkExampleReturn(){
        if(this.exampleConfig.status == 200){
          return false;
        }
        else{
          return true;
        }

      }

  }

  export class Config {
    id: number = 0;
    nodes: NodeModel[] = [];
    edges: EdgeModel[] = [];
    alphabet: string[] = [];
    states: string[] = [];
    status: number = 200;
    errorMessage: string = "";
    ids: number[] = [];
    isDfa: boolean = false;
  }

  export class wordCheck {
    inLanguage: boolean = false;
    errorMessage: string = "";
    word: string = "";
  }