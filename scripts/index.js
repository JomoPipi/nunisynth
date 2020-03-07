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
            a.addChild('oscillator', G.root.audioNode,
            {
                values: { frequency: 2 ** (6 + n/PHI) },
                doConnect: true

            }), G.root)

        G.root.children.forEach((c,n) =>  {
            
            c.addChild('gain', c.audioNode.frequency,
            {
                values: { gain: n * PHI, gain_yAxisFactor: 8 },
            })
            c.children[0].addChild('oscillator', c.children[0].audioNode,
            {
                values: { frequency: 2 ** (n / TAU), frequency_yAxisFactor: PHI },
                doConnect: true,
            })
        })
        G.update()
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






function touchAction(e) {
    const h = K.divisionLine
    const fretTouches = [...e.touches].filter(t => t.screenY <= h).slice(0,1)
    // const strumTouch = [...e.touches].find(t => t.screenY > h)

    // D('txt0').innerHTML = e.touches.length // fretTouches.length
    for (let i = 0; i < Math.min(fretTouches.length,1); i++) {
        const x = fretTouches[i].clientX/W
        const y = 1 - fretTouches[i].screenY/h

        G.nodes.forEach(node => {
            
            for (const prop of numericalControlProperties[node.type]) {
                if (prop === 'detune') continue;
            
                const ymap = node[prop].yAxisFactor
                const Y = ymap < 0 ? 1 - y : y
                const ctkb = node.connectedToKeyboard
                const freqA = ctkb ? K.getFrequencyFactor(x) : 1
                const freqB = (2 * Y) ** Math.abs(ymap)
                
                const freq = node[prop].value * freqA * freqB
    
                node.audioNode[prop].setValueAtTime(freq || 0, 0)
            }
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
