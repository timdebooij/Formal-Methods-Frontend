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
    templateUrl: './operator.component.html',
    styleUrls: ['./operator.component.css']
  })
  @Injectable()
  export class OperatorComponent {
    //first section variables
    @ViewChild('firstVisNetwork', { static: false }) firstVisNetwork!: ElementRef;
    first: number = -999;
    firstConfig: Config = new Config();
    private networkInstance: any;
    loadedFirst: number = -999;

    //second section variables
    @ViewChild('secondVisNetwork', { static: false }) secondVisNetwork!: ElementRef;
    second: number = -999;
    secondConfig: Config = new Config();
    loadedSecond: number = -999;

    //third section variables
    @ViewChild('thirdVisNetwork', { static: false }) thirdVisNetwork!: ElementRef;
    thirdConfig: Config = new Config();
    operation: string = "concat";

    //reverse variables
    reverse: number = -999;
    @ViewChild('reverseVisNetwork', { static: false }) reverseVisNetwork!: ElementRef;
    @ViewChild('templateVisNetwork', { static: false }) templateVisNetwork!: ElementRef;
    tempConfig: Config = new Config();
    reverseConfig: Config = new Config();

    //id variables
    idConfig: Config = new Config();

    constructor(private http: HttpClient, @Inject(DOCUMENT) document: Document) {}
    ngOnInit(): void {
        //this.showConfig()
        this.getIds();
        
      }

      getIds(){
        this.getIdApiCall(GlobalConstants.path + "Network/dfaId")
      }

      getFirstDfa(){
        this.getNetworkFirstApiCall(GlobalConstants.path + "Network/" + this.first)
      }

      getSecondDfa(){
        this.getNetworkSecondApiCall(GlobalConstants.path + "Network/" + this.second)
      }

      getThirdDfa(){
        this.getNetworkThirdApiCall(GlobalConstants.path + "Network/" + this.operation + "/" + this.loadedFirst + "/" + this.loadedSecond)
      }

      getReverseDfa(){
        this.getNetworkRevApiCall(GlobalConstants.path + "Network/comp/" + this.reverse);
      }

      getTemplateDfa(){
        this.getNetworkTempApiCall(GlobalConstants.path + "Network/" + this.reverse)
      }

      getIdApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.idConfig = {...data},
          error: (e: any) => console.error(e),
          complete: () =>this.showIds() })
      }

      showIds(){
          this.first = this.idConfig.ids[0];
          this.second = this.idConfig.ids[0];
          this.reverse = this.idConfig.ids[0];
      }

      getNetworkFirstApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.firstConfig = {...data},
          error: (e: any) => console.error(e),
          complete: () =>this.buildFirstNetwork() })
      }

      getNetworkSecondApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.secondConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.buildSecondNetwork() })
      }

      getNetworkThirdApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.thirdConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.buildThirdNetwork() })
      }

      getNetworkTempApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.tempConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.buildTempNetwork() })
      }

      getNetworkRevApiCall(path: string){
        this.getConfig(path).subscribe({next: (data: Config) => this.reverseConfig = {...data},
        error: (e: any) => console.error(e),
        complete: () =>this.buildRevNetwork() })
      }
      

      getConfig(path: string) {
        return this.http.get<Config>(path);
      }

      checkThirdReturn(){
        if(this.thirdConfig.status == 200){
            return false;
          }
          else{
            return true;
          }
      }

      buildFirstNetwork(){
        if(this.firstConfig.status == 200){
            this.loadedFirst = this.firstConfig.id;
          const nodes = new DataSet<any>([])
          const edges = new DataSet<any>([])
      
          for(let i = 0; i < this.firstConfig.nodes.length; i++){
            nodes.add(this.firstConfig.nodes[i])
          }
          for(let j = 0; j < this.firstConfig.edges.length; j++){
            edges.add(this.firstConfig.edges[j])
          }
          const data = { nodes, edges };
  
          var options = {
            width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
            height: (310) + "px"
          };
       
          const container = this.firstVisNetwork;
          this.networkInstance = new Network(container.nativeElement, data, options);
        }
        
      }

      buildSecondNetwork(){
        if(this.secondConfig.status == 200){
            this.loadedSecond = this.secondConfig.id;
          const nodes = new DataSet<any>([])
          const edges = new DataSet<any>([])
      
          for(let i = 0; i < this.secondConfig.nodes.length; i++){
            nodes.add(this.secondConfig.nodes[i])
          }
          for(let j = 0; j < this.secondConfig.edges.length; j++){
            edges.add(this.secondConfig.edges[j])
          }
          const data = { nodes, edges };
  
          var options = {
            width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
            height: (310) + "px"
          };
       
          const container = this.secondVisNetwork;
          this.networkInstance = new Network(container.nativeElement, data, options);
        }
      }

      buildThirdNetwork(){
        if(this.thirdConfig.status == 200){
          const nodes = new DataSet<any>([])
          const edges = new DataSet<any>([])
      
          for(let i = 0; i < this.thirdConfig.nodes.length; i++){
            nodes.add(this.thirdConfig.nodes[i])
          }
          for(let j = 0; j < this.thirdConfig.edges.length; j++){
            edges.add(this.thirdConfig.edges[j])
          }
          const data = { nodes, edges };
  
          var options = {
            width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
            height: (310) + "px"
          };
       
          const container = this.thirdVisNetwork;
          this.networkInstance = new Network(container.nativeElement, data, options);
        }
    }

    buildTempNetwork(){
      if(this.tempConfig.status == 200){
        const nodes = new DataSet<any>([])
        const edges = new DataSet<any>([])
    
        for(let i = 0; i < this.tempConfig.nodes.length; i++){
          nodes.add(this.tempConfig.nodes[i])
        }
        for(let j = 0; j < this.tempConfig.edges.length; j++){
          edges.add(this.tempConfig.edges[j])
        }
        const data = { nodes, edges };

        var options = {
          width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
          height: (310) + "px"
        };
     
        const container = this.templateVisNetwork;
        this.networkInstance = new Network(container.nativeElement, data, options);
      }
  }

  buildRevNetwork(){
    if(this.reverseConfig.status == 200){
      const nodes = new DataSet<any>([])
      const edges = new DataSet<any>([])
  
      for(let i = 0; i < this.reverseConfig.nodes.length; i++){
        nodes.add(this.reverseConfig.nodes[i])
      }
      for(let j = 0; j < this.reverseConfig.edges.length; j++){
        edges.add(this.reverseConfig.edges[j])
      }
      const data = { nodes, edges };

      var options = {
        width: (document.getElementById("networkWidth")?.offsetWidth) + "px",
        height: (310) + "px"
      };
   
      const container = this.reverseVisNetwork;
      this.networkInstance = new Network(container.nativeElement, data, options);
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