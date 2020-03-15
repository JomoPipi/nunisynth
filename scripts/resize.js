'use strict'


window.addEventListener('resize', resizeHandler)
window.addEventListener('orientationchange', resizeHandler)

function resizeHandler() {
    KB.update()
    G.update()
}