import { AfterViewInit, Component, ElementRef, Input, OnInit, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { DataSet } from 'vis-data';
import { Network, Edge } from 'vis-network';
import { Models } from './models/Models';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { NodeModel } from './models/NodeModel';
import { EdgeModel } from './models/EdgeModel';
import { DashboardComponent } from './dashboard/dashboard.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

@Injectable()
export class AppComponent implements OnInit, AfterViewInit{
  @ViewChild('visNetwork', { static: false }) visNetwork!: ElementRef;
  private networkInstance: any;
  path = "";


  constructor(private http: HttpClient) {}
  ngOnInit(): void {
    //this.showConfig()
    
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes)
  }
 
  getNetwork(){
    this.getNetworkApiCall("https://localhost:44360/Network")
  }

  createNewNetwork(){
    this.getNetworkApiCall("https://localhost:44360/Network/create/1/ab")
  }

  addTransition(){
    this.getNetworkApiCall("https://localhost:44360/Network/add/1/A/a/B")
  }

  setStartState(){
    this.getNetworkApiCall("https://localhost:44360/Network/start/1/A")
  }

  setEndState(){
    this.getNetworkApiCall("https://localhost:44360/Network/end/1/B")
  }

  getNetworkApiCall(path: string){
    this.getConfig(path).subscribe({next: (data: Config) => this.config = {...data},
      error: (e) => console.error(e),
      complete: () =>this.buildNetwork() })
  }

  buildNetwork(){
    const nodes = new DataSet<any>([])
    const edges = new DataSet<any>([])

    for(let i = 0; i < this.config.nodes.length; i++){
      nodes.add(this.config.nodes[i])
    }
    for(let j = 0; j < this.config.edges.length; j++){
      edges.add(this.config.edges[j])
    }
    const data = { nodes, edges };
 
    const container = this.visNetwork;
    this.networkInstance = new Network(container.nativeElement, data, {});
  }

  config: Config = new Config();
  getConfig(path: string) {
    // now returns an Observable of Config
    //this.path = "https://formalmethodapi.herokuapp.com/Network"
    return this.http.get<Config>(path);
  }

  ngAfterViewInit(): void {
    
  }

}

export class Config {
  nodes: NodeModel[] = [];
  edges: EdgeModel[] = [];
}
