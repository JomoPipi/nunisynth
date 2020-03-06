'use strict'


G.canvas.addEventListener('mousedown', handleGraphTouch)



function handleDeleteNode() {
    const p = G.selectedNode.parent
    if (!p) {
        G.selectedNode.children.forEach(child => child.audioNode.disconnect())
        G.selectedNode.children.length = 0
    } else {
        const i = p.children.findIndex(c => c === G.selectedNode)
        p.children[i].audioNode.disconnect()
        p.children.splice(i,1)
    }
    G.update()
    D('node-edit-page').style.display = 'none'
}










function handleGraphTouch(e) {
    const [X,Y] = [e.clientX,e.clientY]
    
    const touched = G.selectedNode = G.nodes.find(({display:{x,y}}) => 
        ( (x-X)**2 + (y-Y)**2 ) ** 0.5 < G.nodeRadius)
        
    if (touched) {
        // "refill" the node-edit UI

        D('node-edit-page-text').innerHTML = `${touched.type} ID: ${touched.id}`
        D('y-axis-factor').value = D('y-axis-factor-text').innerHTML = touched.yAxisFactor

        switch (touched.type) {
            case nodetypes.OSC:
                D('osc-type').value = touched.audioNode.type
                D('osc-frequency-value').value = touched.frequency.value
                D('osc-frequency-slider').value = toSliderValue(touched.frequency.value)
                D('connect-osc-to-kb-btn')
                    .classList[touched.connectedToKeyboard ? 'add' : 'remove']('selected')

                break

            case nodetypes.GAIN:
                D('gain-value').value = touched.gain.value
                D('gain-slider').value = toSliderValue(touched.gain.value)

                break

            case nodetypes.FILTER:
                D('filter-type').value = touched.audioNode.type

                break
        }

        D('osc-only-box').style.display = touched.type === 'oscillator' ? 'grid' : 'none'
        D('gain-only-box').style.display = touched.type === 'gain' ?      'grid' : 'none'
        D('filter-only-box').style.display = touched.type === 'filter' ?  'grid' : 'none'

    }
    D('node-edit-page').style.display = touched ? 'block' : 'none'

    G.paint()
}
