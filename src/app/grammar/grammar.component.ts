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
    selector: 'grammar',
    templateUrl: './grammar.component.html',
    styleUrls: ['./grammar.component.css']
  })
  @Injectable()
  export class GrammarComponent {
    private networkInstance: any;
    ndfa: number = 0;
    loadingNumber: number = -999;
    idConfig: Config = new Config();
    ndfaConfig: Config = new Config();
    grammarConfig: GrammarConfig = new GrammarConfig();
    grammarList: string[] = [];
    @ViewChild('ndfaVisNetwork', { static: false }) ndfaVisNetwork!: ElementRef;

    ngOnInit(): void {
      this.getIds();
    }
    constructor(private http: HttpClient, @Inject(DOCUMENT) document: Document) {}

    loadNdfa(){
      this.getNDFAApiCall(GlobalConstants.path + "Network/" + this.ndfa);
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

    getGrammar(){
      this.getGrammarApiCall(GlobalConstants.path + "network/togrammar/" + this.loadingNumber);
    }

    getIds(){
      this.getIdApiCall(GlobalConstants.path + "Network/ndfaId")
    }

    getIdApiCall(path: string){
      this.getConfig(path).subscribe({next: (data: Config) => this.idConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.showIds() })
    }

    getGrammarApiCall(path: string){
      this.getGrammarConfig(path).subscribe({next: (data: GrammarConfig) => this.grammarConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.showGrammar() })
    }

    showGrammar(){
      this.grammarList = this.grammarConfig.grammar;
    }

    showIds(){
      this.ndfa = this.idConfig.ids[0];
    }

    getConfig(path: string) {
      return this.http.get<Config>(path);
    }
    getGrammarConfig(path: string) {
      return this.http.get<GrammarConfig>(path);
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

  export class GrammarConfig {
    grammar: string[] = [];
  }