'use strict'



function handleAddChild() {
    G.selectedNode.addChild(
        D('child-type-select').value)
    G.draw()
}




function handleAddControlChild() {
    G.selectedNode.addChild(
        D('child-type-select').value, 
        {nodeProp: getControlProperty[G.selectedNode.type]}
    )
    G.draw()
}




function handleDeleteNode() {
    const p = G.selectedNode.parent
    if (!p) {
        G.selectedNode.children.forEach(child => child.node.disconnect())
        G.selectedNode.children.length = 0
    } else {
        const i = p.children.findIndex(c => c === G.selectedNode)
        p.children[i].node.disconnect()
        p.children.splice(i,1)
    }
    G.draw()
    D('note-edit-page').style.display = 'none'
}
