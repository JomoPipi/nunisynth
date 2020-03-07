'use strict'




const Pages = [...document.getElementsByClassName('page')]




function showPage(page) {
    Pages.forEach(p => p.style.display = p === page ? 'block' : 'none')
    
    // turn off sound on the keyboard page unless you actually play notes
    if (page.id === 'keyboard-page') {
        G.savedGain = masterGain.gain.value
        masterGain.gain.setValueAtTime( 0, 0)
    } else {
        masterGain.gain.setValueAtTime( 
            G.savedGain || masterGain.gain.value, 0)

        // reset all the node's values
        G.nodes.forEach(node => {
            for (const prop of numericalControlProperties[node.type]) {
                node.audioNode[prop].setValueAtTime(node[prop].value, 0)
            }
        })
    }
}