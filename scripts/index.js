'use strict'

// 3 types of nodes: source, effect, destination

const G = new NuniGraph(masterGain, D('nuni-graph'), { animate: true })

const KB = new Keyboard(D('keyboard'))
KB.toggleSidePanel()

const graphs = []

const lowVol = 1e-2

const FORCE_LANDSCAPE = startScreenSetup({
    func: _ => {
        preset(G)[0]()
        showPage(D('keyboard-page'))
        KB.update()
        G.update()
    },
    text: `
    <p style='position:absolute;top:0;font-size:1em'>
        use your mobile device in landscape mode
    </p>
    
    <span style='position:absolute;bottom:5%;font-size:2em'>
        Nuni 
        <p>
            version 0.1
        </p>
    </span>
`
})
function noteOn(x,y) {

    const [pitchFactor, vertFactor, keynum] = KB.getFrequencyFactorsAndKeyNumber(x,y)
    const newlyHeld = KB.keyConnectsTo[keynum] == null

    if (newlyHeld) {
        const g = graphs.shift()
        KB.keyConnectsTo[keynum] = g.adsr
        g.adsr.graph = g
        graphs.push(g)
    }
    const adsr = KB.keyConnectsTo[keynum]
    
    adsr.graph.nodes.forEach(node => {
        for (const prop of audioParamsOfType[node.type]) {

            if (prop === 'detune') {
                continue
            }
        
            const ymap = node[prop].yAxisFactor
            const Y = ymap > 0 ? 1 - vertFactor : vertFactor
            const ctkb = node.connectedToKeyboard
            const freqA = ctkb ? pitchFactor : 1
            const freqB = (2 * Y) ** Math.abs(ymap)
            
            const value = node[prop].value * freqA * freqB

            const aux_val = node[prop].auxAdsrVal

            const property = node.audioNode[prop]
            
            // add ADSR to these sometime?
            if (aux_val && newlyHeld) {
                
                const { attack, decay } = aux_ADSR
                
                const t = audioCtx.currentTime
                const t1 = t + attack ** 2
                
                property.cancelScheduledValues(t)
                property.setValueAtTime(value, t)
                property.linearRampToValueAtTime((2 ** aux_val) * value, t1)
                property.linearRampToValueAtTime(value, t1 + decay ** 2)
            }
            else
            {
                property.setValueAtTime(value|| 0, 0)
            }

        }
    })

    if (newlyHeld) {
        
        const { attack, decay, sustain } = ADSR
        const t = audioCtx.currentTime
        const t1 = t + attack

        // adsr.gain.setValueAtTime(0, t)
        adsr.gain.cancelScheduledValues(t)
        adsr.gain.setTargetAtTime(G.volume, t, attack)
        adsr.gain.setTargetAtTime(sustain ** 2, t1, decay)

        // const [red,green,blue] = [0,0,0].map((_,i) => 150 + (Math.sin(i+keynum/PHI)*105)|0)
        // KB.canvas.style.backgroundColor = `rgb(${red},${green},${blue})`
    }

    return keynum
}


function noteOff(i) {

    const adsr = KB.keyConnectsTo[i]
    KB.keyConnectsTo[i] = null
    const { release } = ADSR
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


KB.canvas.addEventListener('touchstart', touch)
KB.canvas.addEventListener('touchmove',  touch)
KB.canvas.addEventListener('touchend',   touch)

function touch(e) {
    const arr = [...e.touches].reverse().slice(0,nGraphs)
    
    return KB.processCoordinateArray(
        arr,
        noteOn,
        noteOff
    )
}