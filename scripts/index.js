'use strict'

// 3 types of nodes: source, effect, destination


const G = new NuniGraph(masterGain, D('nuni-graph'), { animate: true })

const KB = new Keyboard(D('fretboard'))

const graphs = []
// get mutated by resize
var H = KB.canvas.height = G.canvas.height = window.innerHeight
var W = KB.canvas.width = G.canvas.width = window.innerWidth

startScreenSetup({
    func: _ => {
        preset(G)[0]()
        showPage(D('keyboard-page'))
    },
    text: 'NuniSynth <br><br><br><br> version 0.1'
})


KB.update()
G.update()


KB.canvas.addEventListener('touchstart',touchAction)
KB.canvas.addEventListener('touchmove', touchAction)
KB.canvas.addEventListener('touchend',  touchAction)
// KB.canvas.addEventListener('pointermove',mouseAction) // TODO: listen for key-down and key-up events, unless using continuous mouse
// KB.canvas.addEventListener('pointerout', mouseAction)



const lowVol = 1e-2

function noteEnd(adsr) {
    
    const release = ADSR[3]
    const t = audioCtx.currentTime
    adsr.gain.cancelScheduledValues(t)
    adsr.gain.setValueAtTime(adsr.gain.value, t)
    adsr.gain.setTargetAtTime(0, t, release)

    const stop = setInterval(() => {
        if (adsr.gain.value < lowVol) {
            adsr.gain.cancelScheduledValues(t)
            adsr.gain.setValueAtTime(adsr.gain.value, t)
            adsr.gain.setTargetAtTime(0, t, release)
            const i = graphs.findIndex(g => g.adsr === adsr)
            const g = graphs.splice(i,1)[0]
            graphs.unshift(g)
            clearInterval(stop)
        }
    }, 10);
}

function holdNote(x,y) {
    const [pitchFactor, vertFactor, keynum] = KB.getFrequencyFactorsAndKeyNumber(x,y)
    const newlyHeld = KB.keyConnectsTo[keynum] == null
    if (newlyHeld) {
        // log('graphs = ',graphs)
        const g = graphs.shift()
        KB.keyConnectsTo[keynum] = g.adsr
        g.adsr.graph = g
        graphs.push(g)
    }
    const adsr = KB.keyConnectsTo[keynum]
    
    
    adsr.graph.nodes.forEach(node => {
        for (const prop of numericalControlProperties[node.type]) {
            if (prop === 'detune') continue;
        
            const ymap = node[prop].yAxisFactor
            const Y = ymap > 0 ? 1 - vertFactor : vertFactor
            const ctkb = node.connectedToKeyboard
            const freqA = ctkb ? pitchFactor : 1
            const freqB = (2 * Y) ** Math.abs(ymap)
            
            const value = node[prop].value * freqA * freqB

            // add ADSR to these sometime?
            node.audioNode[prop].setValueAtTime(value|| 0, 0)
        }
    })

    if (newlyHeld) {
        
        const [atk,dec,sus] = ADSR

        const t = audioCtx.currentTime
        adsr.gain.cancelScheduledValues(t)
        // adsr.gain.setValueAtTime(0,t)

        // attack
        const t1 = t + atk
        adsr.gain.linearRampToValueAtTime(G.volume, t1) // G.volume for 1?

        // decay
        adsr.gain.setTargetAtTime(sus, t1, dec)
    }

    return keynum
}

function touchAction(e) {
    const h = KB.divisionLine
    const fretTouches = [...e.touches].filter(t => t.screenY <= h).slice(0,nGraphs)
    const presses = new Set()
    // const strumTouch = [...e.touches].find(t => t.screenY > h)
    // D('txt0').innerHTML = e.touches.length // fretTouches.length

    // try {



        fretTouches.forEach(t => {
            const x = t.clientX/W
            const y = t.clientY/H
    
            const keyNumber = holdNote(x,y)
            presses.add(keyNumber)
        })
        
        for (const i in KB.keyConnectsTo) {
            if (!presses.has(+i)) {
                if (KB.keyConnectsTo[i]) {
                    noteEnd(KB.keyConnectsTo[i])
                }
                KB.keyConnectsTo[i] = null
            }
        }
    


    // } catch (e) {
    //     showErr(e)
    // }
    // for (let i = 0; i < fretTouches.length; i++) {
    //     const x = fretTouches[i].clientX/W
    //     const y = 1 - fretTouches[i].screenY/h

    //     noteOn(i,x,y)
    // }
    // for (let i = fretTouches.length; i < nGraphs; i++) {

    //     noteEnd(i)
    // }
    // debug(fretTouches.length)
    
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
    //     KB.pitchBend = (x => 1 + x*x)((y-k)/(H-k))

    //     lfo.frequency.value = x/W < 0.01 ? 0 :
    //         x ** 1.618033988/W
    // }
}
