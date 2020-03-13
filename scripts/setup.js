'use strict'








const log = console.log


function showErr(e) {
    (p => (
        p.style.font = '2em Arial Black',
        p.innerHTML = e
    ))(document.body)
}
function debug(...x) {
    D('debug').innerHTML = x.join`<br>`
}



const E = x => document.createElement(x)
const D = x => document.getElementById(x)






// web audio API declaration
const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

const nGraphs = 3

const masterGain = audioCtx.createGain()
    masterGain.gain.setValueAtTime(0.5 / nGraphs, 0)
    masterGain.connect(audioCtx.destination)


const masterGains = [...Array(nGraphs)].map(_ => {
    
    const gain = audioCtx.createGain()
    gain.gain.setValueAtTime(0.5 / nGraphs, 0)
    gain.connect(audioCtx.destination)
    return gain
})

const ADSR = [0.08, .04, .145, .06]
    

// spec says 24000, but I can only hear up to 17k.
const OSCILLATOR_MAX_FREQUENCY = 17000

const TAU = 2 * Math.PI
const PHI = (Math.sqrt(5) + 1) / 2.0
const logPHI = Math.log(PHI)
const sliderConstant = Math.log(OSCILLATOR_MAX_FREQUENCY) / logPHI
const twoThirdsPi = TAU / 3.0
const colorFactor = TAU / (sliderConstant * 2)

function toSliderValue(nodeValue) {
    return Math.round(10000 * Math.log(nodeValue + 1) / logPHI ) / 10000
}

function toNodeValue(sliderValue) { 
    return Math.round(10000 * (PHI ** sliderValue - 1)) / 10000
}






const logo = new Image()
    logo.src = 'logo.png'

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
    S.backgroundColor = '#bebebe'
    S.textAlign = 'center'
    S.alignItems = 'center'
    S.fontSize = '300%'
    startScreen.innerHTML = t
    startScreen.appendChild(logo)
    document.body.append(startScreen)
    startScreen.onmousedown = function() {
        this.style.display = 'none'
        if (f) f()
    }
}
