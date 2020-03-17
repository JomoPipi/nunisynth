'use strict'


window.addEventListener('resize', resizeHandler)
window.addEventListener('orientationchange', resizeHandler)

function resizeHandler() {
    
    if (FORCE_LANDSCAPE.wasTouched)
        FORCE_LANDSCAPE.style.display = 
            window.innerWidth < window.innerHeight ? 'block' : 'none'


    KB.update()
    G.update()
}
resizeHandler()