'use strict'




const Pages = [...document.getElementsByClassName('page')]




function showPage(page) {
    Pages.forEach(p => p.style.display = p === page ? 'block' : 'none')
    

    // turn off sound on the keyboard page unless you actually play notes
    if (page.id === 'keyboard-page') {
        G.volume = masterGains[0].gain.value
        masterGains[0].gain.setValueAtTime( 0, 0)

        for (let i = 1; i < nGraphs; i++) {
            const g = G.copy(i)
            g.update()
            graphs.push( g )
        }
    } else {
        graphs.splice(1, nGraphs)

        masterGains[0].gain.setValueAtTime( 
            G.volume || masterGains[0].gain.value, 0)

        // reset all the node's values
        G.nodes.forEach(node => {
            for (const prop of numericalControlProperties[node.type]) {
                node.audioNode[prop].setValueAtTime(node[prop].value, 0)
            }
        })
    }
}