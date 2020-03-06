'use strict'

// TODO: implement: collapseNode


// const getControlProperties = {
//     gain: 'gain',
//     oscillator:'frequency'
// }


const nodetypes = {
    OSC: 'oscillator',
    GAIN: 'gain',
    FILTER: 'filter'
}

const createNode = {
    gain:'createGain',
    oscillator:'createOscillator',
    filter: 'createBiquadFilter'
}

// osc -- 2 sliders
// gain -- 1 slider
// filter 3 - 4 sliders
const numericalControlProperties = {
    oscillator: ['frequency','detune'],
    gain: ['gain'],
    filter: ['frequency','Q','detune','gain']
}

const defaultPropertyValues = {
    frequency: 330,
    detune: 100,
    gain: 0.5,
    Q: 1
}



const getControlProperty = {
    gain:'gain',
    oscillator:'frequency'
}


const nodeInitialValue = {
    gain: 0.5,
    oscillator: 330,
    filter: 2
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

    constructor(parent, type, destination, options={}){
        super(parent)
        const { doConnect, yAxisFactor, values={} } = options
        
        this.type = type

        this.connectedToKeyboard = doConnect // oscillator only property

        this.yAxisFactor = yAxisFactor || 0 // each property needs to be it's own object.. 
        
        this.audioNode = audioCtx[createNode[type]]()
        if (type === nodetypes.OSC) this.audioNode.start()

        for (const prop of numericalControlProperties[type]) {

            this[prop] = { } // 

            this.setValueOf(prop, values[prop] || defaultPropertyValues[prop])
        }
        
        this.audioNode.connect(destination)
    }
    setValueOf(property, value) {
        /*
        property :: string
        value    :: number
        `this` stores the base values
        `this.audioNode` stores the current values
        */
        this[property].value = value
        this.audioNode[property].setValueAtTime(value, 0)
    }

    addChild(type, destination, options) {
        const node = new NuniGraphNode(this, type, destination, options)
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
        this.root = new NuniGraphNode(null, nodetypes.GAIN, masterGain)
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
                children[i].id = this.nodes.push(children[i])
            }
            const arr = children.reduce((a,v) => [...a,...v.children], [])
            children.splice(0,children.length, ...arr)
        }
    }



    
    update() {
        this.setCoordinates()
        this.paint()
    }
    


    paint() {
        this.ctx.clearRect(0,0,W,H)
        const children = [this.root]
        let isComplete = true
        this.ctx.font = "20px Georgia";
        this.ctx.lineWidth = 4
        while (children.length) {
            for (const c of children) {
                const ctkb = c.connectedToKeyboard

                // const cval = colorFactor * toSliderValue((c.frequency||{}).value || (c.gain||{}).value)
                    
                const nodeColor = '#aaa' // 'rgb(' + [0,1,2].map(n => 100 * (1 + Math.sin(cval + n * twoThirdsPi)) |0).join`,` + ')'
                
                this.ctx.fillStyle = c === this.selectedNode ? 'green' : nodeColor
                
                const [R,G,B] = [0, (c.yAxisFactor * 255 / 9.0 | 0), (+ctkb||0) * 255]

                this.ctx.strokeStyle = `rgb(${R},${G},${B})`

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
                this.ctx.fillStyle = '#999'

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