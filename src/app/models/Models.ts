export module Models{
    export class EdgeModel{
        from: number
        to: number
        label: string
        arrows: string
    
        constructor(from: number, to: number, label: string){
            this.from = from
            this.to = to
            this.label = label
            this.arrows = "to"
        }
        
    }

    export class NodeModel{
        id: number;
        label: string;
    
        constructor(id: number, label: string){
            this.id = id;
            this.label = label;
        }
    }
}

