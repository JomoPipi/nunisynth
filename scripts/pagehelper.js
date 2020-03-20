'use strict'




const Pages = [...document.getElementsByClassName('page')]




function showPage(page) {
    Pages.forEach(p => p.style.display = p === page ? 'block' : 'none')
    
    // turn off sound on the keyboard page unless you actually play notes
    if (page.id === 'keyboard-page') 
    {
        connectShadowGraphs()
    } 
    else 
    {
        // masterGain.gain.value.setValueAtTime(G.volume, audioCtx.currentTime)
        disconnectShadowGraphs()
    }

}

function connectShadowGraphs() {
    masterGain.gain.setValueAtTime(0,audioCtx.currentTime)
    graphs.length = 0
    for (let i = 0; i < nGraphs; i++) {
        const adsr = audioCtx.createGain()
            adsr.gain.value = 0
            adsr.connect(audioCtx.destination)
        const g = G.copy(adsr)
        g.update()
        graphs.push( g )
    }
}

function disconnectShadowGraphs() {
    for (const i in KB.keyConnectsTo) {
        if (KB.keyConnectsTo[i])
            KB.keyConnectsTo[i].graph.root.wipe()
        KB.keyConnectsTo[i] = null
    }

    masterGain.gain.setValueAtTime(G.volume, audioCtx.currentTime)

    // reset all the node's values
    G.nodes.forEach(node => {
        for (const prop of audioParamsOfType[node.type]) {
            node.audioNode[prop].setValueAtTime(node[prop].value, 0)
        }
    })
}