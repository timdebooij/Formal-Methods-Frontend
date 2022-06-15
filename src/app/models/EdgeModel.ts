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