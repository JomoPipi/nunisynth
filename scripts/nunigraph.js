'use strict'

// TODO: implement: collapseNode


const nodetypes = {
    OSC: 'oscillator',
    GAIN: 'gain',
    FILTER: 'filter'
}

const createNode = {
    [nodetypes.OSC]:    'createOscillator',
    [nodetypes.GAIN]:   'createGain',
    [nodetypes.FILTER]: 'createBiquadFilter'
}

const audioParamsOfType = {
    // detune is out because KB.detune handles it
    [nodetypes.OSC]:    ['frequency'], //,'detune'],
    [nodetypes.GAIN]:   ['gain'],
    [nodetypes.FILTER]: ['frequency','Q'], //,'detune','gain']
}

const defaultPropertyValues = {
    frequency: 330,
    detune: 100,
    gain: 0.5,
    Q: 1
}

const setDestination = type => {
    /*
        channel connection: node1.connect(node2)        // x => x       (do nothing)
        other:              node1.connect(node2[param]) // x => x[type] (access the audioParam)
    */
    return type === 'channel' ? x => x : x => x[type]
}

const connectionTypeColors = {
    channel:   'gray',
    frequency: 'blue',
    detune:    'green',
    gain:      'orange',
    Q:         'purple'
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




    constructor(parent, type, connectionType, options={}){
        super(parent)
        
        this.type = type
        this.connectionType = connectionType
        this.parentIsNuni = parent instanceof NuniGraphNode

        const { doConnect, audioNodeType, values={} } = options
        
        this.connectedToKeyboard = doConnect            // oscillator only property (or wav inputs, too?)
        this.audioNode = audioCtx[createNode[type]]()

        if (audioNodeType)
            this.audioNode.type = audioNodeType

        if (type === nodetypes.OSC) 
            this.audioNode.start()

        for (const prop of audioParamsOfType[type]) {

            this[prop] = {}

            this.setValueOf(prop, values[prop] || defaultPropertyValues[prop])

            // it may come pre-set
            this[prop].yAxisFactor = values[prop + '_yAxisFactor'] || 0
            this[prop].auxAdsrVal = values[prop + '_auxAdsrVal'] || 0
        }
        
        const location = setDestination(connectionType)(this.parentIsNuni ? parent.audioNode : parent)
        
        this.audioNode.connect(location)
    }


    

    setMapping(property, maptype, factor) {
        // the Keyboard object knows what to do with this
        this[property][maptype] = factor
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


    
    
    addChild(type, connectionType, options) {
        const node = new NuniGraphNode(this, type, connectionType, options)
        this.children.push(node)
        return this
    }




    addEntireGraph(root) {

        const values = audioParamsOfType[root.type].reduce((a,v) => 
            (a[v] = root[v].value, a)
        , {})

        for (const prop of audioParamsOfType[root.type]) {
            values[prop + '_yAxisFactor'] = root[prop].yAxisFactor
            values[prop + '_auxAdsrVal'] = root[prop].auxAdsrVal
        }
        const settings = {
            doConnect: root.connectedToKeyboard,
            audioNodeType: root.audioNode.type,
            values: values
        }
        this.addChild(root.type, root.connectionType, settings)
        const kid = this.children.slice(-1)[0]
        kid.display = root.display

        // copying detune manually since it's not part of nunigraphnode anymore
        if (root.detune) 
            kid.detune = kid.audioNode.detune = root.detune

        for (const child of root.children) {
            kid.addEntireGraph(child)
        }
    }




    wipe() { 
        this.children.forEach(child => child.wipe()) // - I wonder if it's really necessary but whatever

        const p = this.parent
        if (!p || !this.parentIsNuni) {
            this.children.forEach(child => child.audioNode.disconnect())
            this.children.length = 0
        } else {
            const i = p.children.findIndex(c => c === this)
            p.children[i].audioNode.disconnect()
            p.children.splice(i,1)
        }
    }


}








class BaseGraph {
    constructor (adsr) {
        this.root = new NuniGraphNode(adsr, nodetypes.GAIN, 'channel')
        this.adsr = adsr
        this.nodes = [this.root]
        this.volume = 0.5 / nGraphs
        this.selectedNode = null
    }


    

    deleteSelectedNode() {
        this.selectedNode.wipe()
        this.selectedNode = null
        typeof this.update === 'function' && this.update()
    }
}




class NuniGraph extends BaseGraph {
    constructor(adsr, canvas, { animate }) {
        super(adsr)
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.animate = animate
        this.animationSpeed = 40
        this.depth = 1
        this.nodeRadius = 40
    }



    
    copy(adsr) {
        
        const G = new NuniGraph(adsr, E('canvas'), {})

        G.root.gain.value = this.root.gain.value
        for (const prop of audioParamsOfType[this.root.type]) {
            G.root[prop].yAxisFactor = this.root[prop].yAxisFactor
            G.root[prop].auxAdsrVal = this.root[prop].auxAdsrVal
        }
        
        for (const kid of this.root.children.slice())
            G.root.addEntireGraph(kid)
            
        return G

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
        const W = this.canvas.width  = window.innerWidth
        const H = this.canvas.height = window.innerHeight
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
        const W = this.canvas.width
        const H = this.canvas.height
        
        this.ctx.clearRect(0,0,W,H)
        const children = [this.root]
        let isComplete = true
        this.ctx.font = "20px Georgia";
        this.ctx.lineWidth = 4
        
        while (children.length) {
            for (const c of children) {
                const ctkb = c.connectedToKeyboard

                const prop = audioParamsOfType[c.type][0]
                const pValue = c[prop].value
                const mValue = c[prop].yAxisFactor

                const cval = colorFactor * toSliderValue(pValue)
                const c1 = 'rgb(' + [0,1,2].map(n => 100 * (1 + Math.sin(cval + n * twoThirdsPi)) |0).join`,` + ')'
                const c2 = `rgb(${[0,0,0].map(_ => 256.0 * (1 - Math.abs(mValue / 9.0)) ).join`,`})`

                const {x,y} = c.display, r = this.nodeRadius

                const gradient = this.ctx.createRadialGradient(x, y, r/4, x, y, r)
                    gradient.addColorStop(0, c1)
                    gradient.addColorStop(0.9, c2)

                    
                const nodeColor = gradient 
                
                this.ctx.fillStyle = c === this.selectedNode ? 'red' : nodeColor
                
                const [R,G,B] = [0, (c[prop].yAxisFactor * 255 / 9.0 | 0), (+ctkb||0) * 255]

                this.ctx.strokeStyle = `rgb(${R},${G},${B})`

                const tooSmall = Math.abs(c.desiredX - x) < 1 && Math.abs(c.desiredY - y) < 1

                const [X,Y] = this.animate && !tooSmall ? [
                    (x||0) + (c.desiredX - x) / this.animationSpeed,
                    (y||0) + (c.desiredY - y) / this.animationSpeed
                ] : 
                    [c.desiredX, c.desiredY]
                
                this.circle(X, Y, r)

                this.ctx.strokeStyle = connectionTypeColors[ c.connectionType ] || 'pink'

                if (c.parentIsNuni) {
                    this.line(X, Y,
                        c.parent.display.x,
                        c.parent.display.y
                    )
                } else {
                    this.line(X, 0, X, Y)
                }
                this.ctx.fillStyle = '#999'

                if (D('node-edit-page').style.display !== 'block') { // the text would otherwise get in the way
                    this.ctx.fillText(
                        c.type,
                        X - r,
                        Y - r - 10)
                }

                c.display.x = X
                c.display.y = Y
                isComplete = isComplete && X === x && Y === y
            }
            const arr = children.reduce((a,v) => [...a, ...v.children], [])
            children.splice(0,children.length, ...arr)
            
        }
        if (!isComplete) {
            requestAnimationFrame(_ => this.paint())
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
