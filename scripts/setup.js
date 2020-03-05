'use strict'
















const D = x => document.getElementById(x)
const log = console.log






// web audio API declaration
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

const masterGain = audioCtx.createGain()
    masterGain.gain.setValueAtTime(0.5, 0)
    masterGain.connect(audioCtx.destination)








// spec says 24000, but I can only hear up to 17k.
const OSCILLATOR_MAX_FREQUENCY = 17000

const TAU = 2 * Math.PI
const PHI = (Math.sqrt(5) + 1) / 2.0
const logPHI = Math.log(PHI)
const sliderConstant = Math.log(OSCILLATOR_MAX_FREQUENCY) / logPHI
const twoThirdsPi = TAU / 3.0
const colorFactor = TAU / (sliderConstant * 2)

D('node-slider').max = sliderConstant

function toSliderValue(nodeValue) {
    return Math.round(10000 * Math.log(nodeValue + 1) / logPHI ) / 10000
}

function toNodeValue(sliderValue) { 
    return Math.round(10000 * (PHI ** sliderValue - 1)) / 10000
}







// add title screen -- sound wont start without initial user gesture.
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