'use strict'




G.canvas.addEventListener('mousedown', handleGraphTouch)




function setMasterVolume(value) {
    masterGain.gain.setValueAtTime(G.volume = value, audioCtx.currentTime)
}


function leaveNodeEditPage() {
    D('node-edit-page').style.display = 'none'
    D('mappings-page').style.display = 'none'
    G.selectedNode = null
    G.paint()
}


function handleDeleteNode() {
    G.deleteSelectedNode()
    D('node-edit-page').style.display = 'none'
}


function handleGraphTouch(e) {
    const [X,Y] = [e.clientX,e.clientY]
    
    const touched = G.selectedNode = G.nodes.find(({display:{x,y}}) => 
        ( (x-X)**2 + (y-Y)**2 ) ** 0.5 < G.nodeRadius)
    
    if (touched) {
        // "refill" the node-edit UI
        
        D('node-edit-page-text').innerHTML = `${touched.type} ${touched.id}`

        for (const t in nodetypes) {
            const type = nodetypes[t]

            if (touched.type === type) {
                if (typeTypes[touched.type]) {
                    D('type-select').value = touched.audioNode.type
                }

                for (const prop of audioParamsOfType[type]) {
                    D(`${type}-${prop}-value`).value = touched[prop].value
                    D(`${type}-${prop}-slider`).value = toSliderValue(touched[prop].value)
                }

                if (type === nodetypes.OSC) {
                    D(`${type}-kb-connect`).classList[
                        touched.connectedToKeyboard ? 'add' : 'remove'
                    ]('selected')
                }
            }
        }

        D('oscillator-only-box').style.display = touched.type === nodetypes.OSC ? 'grid' : 'none'
        D('gain-only-box').style.display = touched.type === 'gain' ?             'grid' : 'none'
        D('filter-only-box').style.display = touched.type === 'filter' ?         'grid' : 'none'

    }
    D('node-edit-page').style.display = touched ? 'block' : 'none'

    G.paint()
}