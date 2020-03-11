'use strict'

// 3 types of nodes: source, effect, destination
// const G = new NuniGraph(D('nuni-graph'), masterGain)

// const Graphs = [...Array(nGraphs)].map((_,i) => 
//     new NuniGraph(i === 0 ? D('nuni-graph') : E('canvas'), {animate: i === 0})
// )


const G = new NuniGraph(0, D('nuni-graph'), { animate: true })
// const G = new NuniGraph(D('nuni-graph'),masterGains[0],{animate:true})

const K = new Keyboard(D('fretboard'))

const graphs = [G]
// get mutated by resize
var H = K.canvas.height = G.canvas.height = window.innerHeight
var W = K.canvas.width = G.canvas.width = window.innerWidth

startScreenSetup({
    func: _ => {
        preset(G)[0]()
    },
    text: 'NuniSynth'
})


K.update()
G.update()


K.canvas.addEventListener('touchstart',touchAction)
K.canvas.addEventListener('touchmove', touchAction)
K.canvas.addEventListener('touchend',  touchAction)
// K.canvas.addEventListener('pointermove',mouseAction) // TODO: listen for key-down and key-up events, unless using continuous mouse
// K.canvas.addEventListener('pointerout', mouseAction)




function noteOn(i,x,y) {

    graphs[i].nodes.forEach(node => {
            
        for (const prop of numericalControlProperties[node.type]) {
            if (prop === 'detune') continue;
        
            const ymap = node[prop].yAxisFactor
            const Y = ymap < 0 ? 1 - y : y
            const ctkb = node.connectedToKeyboard
            const freqA = ctkb ? K.getFrequencyFactor(x) : 1
            const freqB = (2 * Y) ** Math.abs(ymap)
            
            const freq = node[prop].value * freqA * freqB

            // add ADSR to these sometime?
            node.audioNode[prop].setValueAtTime(freq || 0, 0)
        }
    })
    masterGains[i].gain.exponentialRampToValueAtTime( 
        0.5 / nGraphs, 
        audioCtx.currentTime + 0.01
    )
    
}

function noteEnd(i,x,y) {

    // masterEnvelope.release()
    masterGains[i].gain.linearRampToValueAtTime( 
        0, 
        audioCtx.currentTime + 0.01 //(K.mg_attack + K.mg_release || 1e-3)
    )
}

function touchAction(e) {
    const h = K.divisionLine
    const fretTouches = [...e.touches].filter(t => t.screenY <= h)
    // const strumTouch = [...e.touches].find(t => t.screenY > h)
    // D('txt0').innerHTML = e.touches.length // fretTouches.length
    for (let i = 0; i < Math.min(fretTouches.length, nGraphs); i++) {
        const x = fretTouches[i].clientX/W
        const y = 1 - fretTouches[i].screenY/h

        noteOn(i,x,y)
    }
    for (let i = fretTouches.length; i < nGraphs; i++) {

        noteEnd(i)
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




// function mouseAction(e) {
//     let b = false
//     for (let i = 0; i < 1/*fretTouches.length*/; i++) {
//         const x = e.clientX/W
//         const y = e.clientY/K.divisionLine
//         b = y > 1
//         G.nodes.forEach(node => {
//             if (!node.connectedToKeyboard) return;

//             const freq =  node.value * K.getFrequencyFactor(x)
               
//             node.audioNode.frequency.setValueAtTime( freq, 0)
//         })
//         const gain = (x => x*x) (1 - y)
        
//         masterGain.gain.setValueAtTime(gain, 0)
//     }
//     if (b) {
//         masterGain.gain.setValueAtTime(0 ,0)
//     }
// }
