'use strict'

// TODO: implement: collapseNode

const getControlProperty = {
    gain:'gain',
    oscillator:'frequency'
}

const createNode = {
    gain:'createGain',
    oscillator:'createOscillator'
}

const nodeInitialValue = {
    gain: 0.5,
    oscillator: 330
}


const NuniGraph = (_ => {







class GraphNode {
    constructor(parent){
        this.parent = parent
        this.children = []
        this.display = {}
    }
}





class NuniGraphNode extends GraphNode {

    constructor(parent, type, options={}){
        super(parent)
        const { nodeProp, value, doConnect, yAxisFactor } = options
        this.type = type
        this.connectsToNodeProp = nodeProp ? true : false
        this.connectedToKeyboard = doConnect
        this.yAxisFactor = yAxisFactor || 0
        this.value = 0.5
        
        this.node = audioCtx[createNode[type]]()
        if (type === 'oscillator') this.node.start()

        this.setValue(value || nodeInitialValue[type])

        this.node.connect( this.parent ? 
            nodeProp ? this.parent.node[nodeProp] : this.parent.node
        : masterGain )
    }
    setValue(x) {
        this.value = x
        this.node[getControlProperty[this.type]].setValueAtTime(x,0)
    }

    addChild(type, options) {
        const node = new NuniGraphNode(this, type, options)
        this.children.push(node)
        return this
    }
}





class NuniGraph {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.animate = true
        this.animationSpeed = 40
        this.depth = 1
        this.root = new NuniGraphNode(null, 'gain')
        this.nodeRadius = 40;
        this.nodes = [this.root]
        this.savedGain = 0.5
    }
    



    setDepth() {
        const children = [this.root]
        this.depth = 0
        while (children.length) {
            this.depth++
            const arr = children.reduce((a,v) => [...a,...v.children], [])
            children.splice(0,children.length, ...arr)
        }
    }
    



    setCoordinates() {
        const children = [this.root]
        let currentDepth = 0
        this.nodes = []
        this.setDepth()
        while (children.length) {
            const n = children.length
            currentDepth++
            for (let i = 0; i < n; i++) {
                children[i].desiredX = (i+1) * W / (n+1)
                children[i].desiredY = currentDepth * H / (this.depth+1)
                if (!children[i].display.x) {
                    children[i].display.x = children[i].desiredX
                    children[i].display.y = children[i].desiredY
                }
                this.nodes.push(children[i])
            }
            const arr = children.reduce((a,v) => [...a,...v.children], [])
            children.splice(0,children.length, ...arr)
        }
    }



    
    draw() {
        this.setCoordinates()
        this.paint()
    }
    


    paint() {
        const twoThirdsPi = TAU / 3.0
        const colorFactor = TAU / (20.6*2)
        this.ctx.clearRect(0,0,W,H)
        const children = [this.root]
        let isComplete = true
        this.ctx.font = "20px Georgia";
        this.ctx.lineWidth = 4
        while (children.length) {
            for (const c of children) {
                const ctkb = c.connectedToKeyboard

                const cval = colorFactor * toSliderValue(c.value)
                    
                const nodeColor = 'rgb(' + [0,1,2].map(n => 100 * (1 + Math.sin(cval + n * twoThirdsPi)) |0).join`,` + ')'
                
                this.ctx.fillStyle = c === this.selectedNode ? 'green' : nodeColor

                this.ctx.strokeStyle =  ctkb ? 'violet' : 'rgba(0,0,0,0)'

                const {x,y} = c.display

                const [X,Y] = this.animate ? [
                    (x||0) + (c.desiredX - x) / this.animationSpeed,
                    (y||0) + (c.desiredY - y) / this.animationSpeed
                ] : 
                    [c.desiredX, c.desiredY]
                
                this.circle(X, Y, this.nodeRadius)

                this.ctx.strokeStyle = 'red'
                if (c.parent) {
                    this.line(X, Y,
                        c.parent.display.x,
                        c.parent.display.y
                    )
                } else {
                    this.line(X, 0, X, Y)
                }
                this.ctx.fillStyle = 'black'

                this.ctx.fillText(
                    c.type,
                    X - this.nodeRadius,
                    Y - this.nodeRadius - 10)

                c.display.x = X
                c.display.y = Y
                isComplete = isComplete && X === x && Y === y
            }
            const arr = children.reduce((a,v) => [...a, ...v.children], [])
            children.splice(0,children.length, ...arr)
            
        }
        if (!isComplete) {
            requestAnimationFrame(this.paint.bind(this))
        }
    }



    circle(x,y,r) {
        this.ctx.beginPath()
        this.ctx.arc(x,y,r,0,7)
        this.ctx.closePath()
        this.ctx.fill()
        this.ctx.stroke()
    }
    
    
    
    line(x,y,ex,ey) {
        this.ctx.beginPath()
        this.ctx.moveTo(x,y)
        this.ctx.lineTo(ex,ey)
        this.ctx.closePath()
        this.ctx.stroke()
    }
}

return NuniGraph

})()