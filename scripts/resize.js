'use strict'


window.addEventListener('resize', resizeHandler)
window.addEventListener('orientationchange', resizeHandler)

function resizeHandler() {

    H = K.canvas.height = G.canvas.height = window.innerHeight
    W = K.canvas.width = G.canvas.width = window.innerWidth

    K.update()
    G.update()
}