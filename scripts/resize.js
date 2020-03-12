'use strict'


window.addEventListener('resize', resizeHandler)
window.addEventListener('orientationchange', resizeHandler)

function resizeHandler() {

    H = KB.canvas.height = G.canvas.height = window.innerHeight
    W = KB.canvas.width = G.canvas.width = window.innerWidth

    KB.update()
    G.update()
}