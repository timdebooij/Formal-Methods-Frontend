import { Component, ElementRef, Inject, Input, ViewChild } from '@angular/core';
import {Router, RouterModule} from '@angular/router'
import { Injectable } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import { HttpClient } from '@angular/common/http';
import { NodeModel } from '../models/NodeModel';
import { EdgeModel } from '../models/EdgeModel';
import { DataSet } from 'vis-data';
import { Network, Edge } from 'vis-network';
import { DOCUMENT } from '@angular/common';
import { GlobalConstants } from '../globals';

@Component({
    selector: 'homescreen',
    templateUrl: './translation.component.html',
    styleUrls: ['./translation.component.css']
  })
  @Injectable()
  export class TranslationComponent {
    expression: string = "";
    parsed: string = "";
    thompsonConfig: Config = new Config();
    @ViewChild('thompsonVisNetwork', { static: false }) thompsonVisNetwork!: ElementRef;
    private networkInstance: any;

    //Minimise variables
    idDfaConfig: Config = new Config();
    dfa: number  = 0;
    dfaPreMinConfig: Config = new Config();
    dfaMinConfig: Config = new Config();
    @ViewChild('dfaPreMinVisNetwork', { static: false }) dfaPreMinVisNetwork!: ElementRef;
    @ViewChild('dfaMinVisNetwork', { static: false }) dfaMinVisNetwork!: ElementRef;

    //ToDfa variables
    idConfig: Config = new Config();
    dfaConfig: Config = new Config();
    ndfa: number = 0;
    loadingNumber: number = 0;
    ndfaConfig: Config = new Config();
    @ViewChild('dfaVisNetwork', { static: false }) dfaVisNetwork!: ElementRef;
    @ViewChild('ndfaVisNetwork', { static: false }) ndfaVisNetwork!: ElementRef;

    ngOnInit(): void {
      this.getIds();
    }
    constructor(private http: HttpClient, @Inject(DOCUMENT) document: Document) {}

    getMinimisation(){
      this.getDfaMinApiCall(GlobalConstants.path + "Network/minimise/" + this.dfa);
    }

    getNdfa(){
      this.parsed = this.expression.replaceAll("+", "@")
      if(this.parsed === ""){
        this.parsed = "-";
      }
      this.getThompsonApiCall(GlobalConstants.path + "network/thompson/" + this.parsed);
    }

    getIds(){
      this.getIdApiCall(GlobalConstants.path + "Network/ndfaId")
    }

    getDfaIds(){
      this.getDfaApiCall(GlobalConstants.path + "Network/dfaId")
    }

    getDfaApiCall(path: string){
      this.getConfig(path).subscribe({next: (data: Config) => this.idDfaConfig = {...data},
      error: (e: any) => console.error(e),
      complete: () =>this.showDfaIds() })
    }

    getDfaMinApiCall(path: string){
      this.getConfig(path).subscribe({next: (data: Config) => this.dfaMinConfig = {...data},
      error: (e: any) => console.error(e),
      complete: () =>this.showDfaMin() })
    }

    getDfaPreMinApiCall(path: string){
      this.getConfig(path).subscribe({next: (data: Config) => this.dfaPreMinConfig = {...data},
      error: (e: any) => console.error(e),
      complete: () =>this.showDfaPreMin() })
    }

    getIdApiCall(path: string){
      this.getConfig(path).subscribe({next: (data: Config) => this.idConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.showIds() })
    }

    showDfaIds(){
      this.dfa = this.idDfaConfig.ids[0];
    }

    showIds(){
      this.ndfa = this.idConfig.ids[0];
      this.getDfaIds();
    }

    loadNdfa(){
      this.getNDFAApiCall(GlobalConstants.path + "Network/" + this.ndfa);
    }

    loadDfa(){
      this.getDfaPreMinApiCall(GlobalConstants.path + "Network/" + this.dfa);
    }

    getDfa(){
      if(this.loadingNumber == 0){
        this.getTransApiCall(GlobalConstants.path + "network/todfa/-999");
      }
      else{
        this.getTransApiCall(GlobalConstants.path + "network/todfa/" + this.ndfa);
      }
      
    }

    getTransApiCall(path: string){
      this.getConfig(path).subscribe({next: (data: Config) => this.dfaConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.showDfa() })
    }

    showDfa(){
      if(this.dfaConfig.status == 200){
        
        const nodes = new DataSet<any>([])
        const edges = new DataSet<any>([])
    
        for(let i = 0; i < this.dfaConfig.nodes.length; i++){
          nodes.add(this.dfaConfig.nodes[i])
        }
        for(let j = 0; j < this.dfaConfig.edges.length; j++){
          edges.add(this.dfaConfig.edges[j])
        }
        const data = { nodes, edges };
  
        var options = {
          width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
          height: (310) + "px"
        };
     
        const container = this.dfaVisNetwork;
        this.networkInstance = new Network(container.nativeElement, data, options);
      }
    }

    showDfaMin(){
      if(this.dfaMinConfig.status == 200){
        
        const nodes = new DataSet<any>([])
        const edges = new DataSet<any>([])
    
        for(let i = 0; i < this.dfaMinConfig.nodes.length; i++){
          nodes.add(this.dfaMinConfig.nodes[i])
        }
        for(let j = 0; j < this.dfaMinConfig.edges.length; j++){
          edges.add(this.dfaMinConfig.edges[j])
        }
        const data = { nodes, edges };
  
        var options = {
          width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
          height: (310) + "px"
        };
     
        const container = this.dfaMinVisNetwork;
        this.networkInstance = new Network(container.nativeElement, data, options);
      }
    }

    showDfaPreMin(){
      if(this.dfaPreMinConfig.status == 200){
        
        const nodes = new DataSet<any>([])
        const edges = new DataSet<any>([])
    
        for(let i = 0; i < this.dfaPreMinConfig.nodes.length; i++){
          nodes.add(this.dfaPreMinConfig.nodes[i])
        }
        for(let j = 0; j < this.dfaPreMinConfig.edges.length; j++){
          edges.add(this.dfaPreMinConfig.edges[j])
        }
        const data = { nodes, edges };
  
        var options = {
          width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
          height: (310) + "px"
        };
     
        const container = this.dfaPreMinVisNetwork;
        this.networkInstance = new Network(container.nativeElement, data, options);
      }
    }

    getThompsonApiCall(path: string){
      this.getConfig(path).subscribe({next: (data: Config) => this.thompsonConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.showThompson() })
    }

    getNDFAApiCall(path: string){
      this.getConfig(path).subscribe({next: (data: Config) => this.ndfaConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.showNdfa() })
    }

    showNdfa(){
      if(this.ndfaConfig.status == 200){
        this.loadingNumber = this.ndfaConfig.id;
        const nodes = new DataSet<any>([])
        const edges = new DataSet<any>([])
    
        for(let i = 0; i < this.ndfaConfig.nodes.length; i++){
          nodes.add(this.ndfaConfig.nodes[i])
        }
        for(let j = 0; j < this.ndfaConfig.edges.length; j++){
          edges.add(this.ndfaConfig.edges[j])
        }
        const data = { nodes, edges };
  
        var options = {
          width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
          height: (310) + "px"
        };
     
        const container = this.ndfaVisNetwork;
        this.networkInstance = new Network(container.nativeElement, data, options);
      }
    }

    showThompson(){
      if(this.thompsonConfig.status == 200){
      const nodes = new DataSet<any>([])
      const edges = new DataSet<any>([])
  
      for(let i = 0; i < this.thompsonConfig.nodes.length; i++){
        nodes.add(this.thompsonConfig.nodes[i])
      }
      for(let j = 0; j < this.thompsonConfig.edges.length; j++){
        edges.add(this.thompsonConfig.edges[j])
      }
      const data = { nodes, edges };

      var options = {
        width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
        height: (310) + "px"
      };
   
      const container = this.thompsonVisNetwork;
      this.networkInstance = new Network(container.nativeElement, data, options);
    }
    }

    getConfig(path: string) {
      return this.http.get<Config>(path);
    }

    checkReturn(){
      if(this.thompsonConfig.status == 200){
          return false;
        }
        else{
          return true;
        }
    }

    checkTransReturn(){
      if(this.dfaConfig.status == 200){
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
  }