'use strict'




const Pages = [...document.getElementsByClassName('page')]




function showPage(page) {
    Pages.forEach(p => p.style.display = p === page ? 'block' : 'none')
    
    // turn off sound on the keyboard page unless you actually play notes
    if (page.id === 'keyboard-page') {
        masterGain.disconnect()
        graphs.length = 0
        for (let i = 0; i < nGraphs; i++) {
            const adsr = audioCtx.createGain()
                adsr.gain.value = 0
                adsr.connect(audioCtx.destination)
            const g = G.copy(adsr)
            g.update()
            graphs.push( g )
        }

    } else {
        // masterGain.gain.value.setValueAtTime(G.volume, audioCtx.currentTime)

        for (const i in KB.keyConnectsTo) {
            if (KB.keyConnectsTo[i])
                KB.keyConnectsTo[i].graph.root.wipe()
            KB.keyConnectsTo[i] = null
        }

        masterGain.connect(audioCtx.destination)
        G.root.audioNode.connect(masterGain)

        // reset all the node's values
        G.nodes.forEach(node => {
            for (const prop of numericalControlProperties[node.type]) {
                node.audioNode[prop].setValueAtTime(node[prop].value, 0)
            }
        })
    }

}