'use strict'

// 3 types of nodes: source, effect, destination
const G = new NuniGraph(D('nuni-graph'))


const K = new Keyboard(D('fretboard'))


// get mutated by resize
var H = K.canvas.height = G.canvas.height = window.innerHeight
var W = K.canvas.width = G.canvas.width = window.innerWidth

startScreenSetup({
    func: _ => {
        ;[...Array(5)].reduce((a,_,n) =>
            a.addChild('oscillator', 
            {
                value: 2 ** (6 + n/PHI),
                doConnect: true

            }), G.root)

        G.root.children.forEach((c,n) =>  {
            c.addChild('gain', 
            {
                nodeProp: 'frequency',
                value: n * PHI,
                yAxisFactor: 8
            })
            c.children[0].addChild('oscillator', 
            {
                value: 2 ** (n / TAU),
                doConnect: true,
                yAxisFactor: PHI
            })
        })
        G.draw()
    },
    text: 'NuniSynth'
})


K.update()
G.draw()


G.canvas.addEventListener('mousedown', handleGraphTouch)
K.canvas.addEventListener('touchstart',touchAction)
K.canvas.addEventListener('touchmove', touchAction)
K.canvas.addEventListener('touchend',  touchAction)
// K.canvas.addEventListener('pointermove',mouseAction) // TODO: listen for key-down and key-up events, unless using continuous mouse
// K.canvas.addEventListener('pointerout', mouseAction)





function handleGraphTouch(e) {
    const [X,Y] = [e.clientX,e.clientY]
    
    const touched = G.selectedNode = G.nodes.find(({display:{x,y}}) => 
        ( (x-X)**2 + (y-Y)**2 ) ** 0.5 < G.nodeRadius)
        
    if (touched) {
        // "refill" the node-edit UI
        D('osc-type').value = touched.node.type
        D('node-value').value = touched.value
        D('node-slider').value = toSliderValue(touched.value)

        D('y-axis-factor').value = D('y-axis-factor-text').innerHTML = touched.yAxisFactor

        D('osc-only-box').style.display = touched.type === 'oscillator' ? 'block' : 'none'
        D('connect-osc-to-kb-btn')
            .classList[touched.connectedToKeyboard ? 'add' : 'remove']('selected')
    }
    D('node-edit-page').style.display = touched ? 'block' : 'none'
    G.paint()
}



function touchAction(e) {
    const h = K.divisionLine
    const fretTouches = [...e.touches].filter(t => t.screenY <= h).slice(0,1)
    // const strumTouch = [...e.touches].find(t => t.screenY > h)

    // D('txt0').innerHTML = e.touches.length // fretTouches.length
    for (let i = 0; i < Math.min(fretTouches.length,1); i++) {
        const x = fretTouches[i].clientX/W
        const y = 1 - fretTouches[i].screenY/h

        G.nodes.forEach(node => {
            const ctkb = node.connectedToKeyboard
            const freqA = ctkb ? K.getFrequencyFactor(x) : 1
            const freqB = (2 * y) ** node.yAxisFactor
            
            const freq = node.value * freqA * freqB

            node.node[getControlProperty[node.type]].setValueAtTime(freq || 0, 0)
        })
        masterGain.gain.setValueAtTime( 0.5, 0)
    }
    if (fretTouches.length === 0) {
        masterGain.gain.setValueAtTime( 0, 0)
    }
    // D('debug').innerHTML = e.touches[0].screenY
    // if (strumTouch) {
    //     const [x,y] = [strumTouch.screenX,strumTouch.screenY]

    //     ctx.clearRect(0,k,W,H-k)

    //     ctx.strokeStyle = 'black'
    //     ctx.beginPath()
    //     ctx.moveTo(x,k)
    //     ctx.lineTo(x,H)
    //     ctx.stroke()

    //     ctx.strokeStyle = 'red'
    //     ctx.beginPath()
    //     ctx.moveTo(0,y)
    //     ctx.lineTo(W,y)
    //     ctx.stroke()
    //     K.pitchBend = (x => 1 + x*x)((y-k)/(H-k))

    //     lfo.frequency.value = x/W < 0.01 ? 0 :
    //         x ** 1.618033988/W
    // }
}




function mouseAction(e) {
    let b = false
    for (let i = 0; i < 1/*fretTouches.length*/; i++) {
        const x = e.clientX/W
        const y = e.clientY/K.divisionLine
        b = y > 1
        G.nodes.forEach(node => {
            if (!node.connectedToKeyboard) return;

            const freq =  node.value * K.getFrequencyFactor(x)
               
            node.node.frequency.setValueAtTime( freq, 0)
        })
        const gain = (x => x*x) (1 - y)
        log(gain)
        masterGain.gain.setValueAtTime(gain, 0)
    }
    if (b) {
        masterGain.gain.setValueAtTime(0 ,0)
    }
}
