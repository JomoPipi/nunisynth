'use strict'




const D = x => document.getElementById(x)
const log = console.log






// web audio API declaration
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

const masterGain = audioCtx.createGain()
    masterGain.gain.setValueAtTime(0.5, 0)
    masterGain.connect(audioCtx.destination)










const TAU = 2 * Math.PI
const PHI = 1.61803398875
const rangeSliderMax = 20.6
const logPHI = Math.log(PHI)


function toSliderValue(nodeValue) {
    return Math.round(10000 * Math.log(nodeValue + 1) / logPHI ) / 10000
}

function toNodeValue(sliderValue) { 
    return Math.round(10000 * (PHI ** sliderValue - 1)) / 10000
}







// add title -- sound wont start without initial user gesture.
function startScreenSetup({func: f, text: t}) {
    const startScreen = document.createElement('div')
    const S = startScreen.style
    S.position = 'absolute'
    S.display = 'flex'
    S.top = '0px'
    S.left = '0px'
    S.width = '100%'
    S.height = '100%'
    S.zIndex = '99'
    S.backgroundColor = 'orange'
    S.textAlign = 'center'
    S.alignItems = 'center'
    S.fontSize = '300%'
    startScreen.innerHTML = t
    document.body.append(startScreen)
    startScreen.onmousedown = function() {
        this.style.display = 'none'
        if (f) f()
    }
}