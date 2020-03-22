/*

A keyboard takes as input the user touch and outputs frequency values

*/




const TR2 = 2 ** (1.0 / 12.0)

// const scaleSteps = [...Array(12)].reduce(a =>
//     [2,2,1,2,2,2,1].reduce((b,v) => b.concat(v+b[b.length-1]), a)
// , [0])

// const oldScaleStepsBase = [2,2,1,2,2,2,1] // <- the legit one
const scaleStepsBase = [2,2,1,2,2,2,1] 

// const scaleSteps = [...Array(12)].reduce(a => 
//     oldScaleStepsBase.reduce((b,v) => b.concat(v+b[b.length-1]), a)
// , [0])

const modeSteps = [...Array(8)].map((_,i) => 
    [...Array(12)].reduce(a => 
        ((xs => [...xs.slice(i), ...xs.slice(0,i)] ) (scaleStepsBase))
        .reduce((b,v) => b.concat(v+b[b.length-1]), a)
    , [0])
)
// const modeSteps = [...Array(8)].map((_,i) => 
//     [...Array(12)].reduce(a => 
//         ((xs => [...xs.slice(i), ...xs.slice(0,i)] ) (scaleStepsBase.concat(0)))
//         .reduce((b,v) => b.concat(v+b[b.length-1]), a)
//     , [0])
// )


const magicOffset = .86

class Keyboard {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.wDiv = this.hDiv = 1
        this.octaves = this.rows = 3
        this.kbMode = 'major',
        this.panelOpen = 0
        this.panelWidth = .4 // .4
        this.NRT2 = TR2,
        this.notesPerOctave = 12
        this.keyConnectsTo = {}
        this.lastRequestID = null
        this.modeShift = 0
        this.pitchShift = 0
        this.detune = 0 
    }
    

    getFrequencyFactor(x) {
        const keyNumber = x * this.notesPerOctave * this.octaves | 0
        return (
            this.kbMode === 'microtonal' ?

                this.NRT2 ** keyNumber :

                TR2 ** scaleSteps[keyNumber])
    }

    
    
    getFrequencyFactorsAndKeyNumber(x,y) {
        const row =  y * this.rows | 0
        const keysOnThisRow = this.keysOnEachRow[row]
        const column = keysOnThisRow * x | 0

        const keyNumber = [...Array(row)].reduce((a,_,r) => 
            a + this.keysOnEachRow[r] | 0, column) - row
        
        const vertFactor = this.rows * (y % (1.0 / this.rows)) 

        return [
            TR2 ** this.pitchShift * (
                this.kbMode === 'microtonal' ?

                    this.NRT2 ** keyNumber :

                    TR2 **  modeSteps[this.modeShift][keyNumber]
                ), 
            vertFactor,
            keyNumber
        ]
    }
    



    update() { 
        const canvas = this.canvas
        canvas.style.width = (100 * this.wDiv * magicOffset) + '%'
        
        canvas.width  = canvas.offsetWidth * this.wDiv * magicOffset// because of the two 7% wood panels
        canvas.height = canvas.offsetHeight
        
        const W = canvas.width
        const H = canvas.height

        const notChromatic = this.kbMode !== 'microtonal'

        if (notChromatic)
        {   // update: modes, and this is the easiest way to handle them

            this.modeShift = 'major,dorian,phrygian,lydian,mixolydian,minor,locrian'.split`,`.indexOf(this.kbMode)
        }




        if (notChromatic) this.notesPerOctave = 7

        const range = this.octaves
        const n = this.notesPerOctave
        const keys = n * range
        
        this.keysOnEachRow = [...Array(this.rows)].map((_,r) => 
            (keys / this.rows | 0) + +(keys % this.rows > r) + 1)


        this.ctx.strokeStyle = 'black'
        this.ctx.lineWidth = 0//25 / (n * range)

        const margin = 0.0

        const rowHeight = H /this.rows
        
        let keyNumber = 0
        ;this.keysOnEachRow.forEach((nKeys,row) => {

            const keyWidth = W / nKeys
            const y = rowHeight * row

            
            const keycolor = [...Array(n)].map((_,i) => {
                const shift = notChromatic ? 
                    this.modeShift === 6 ? PHI : this.modeShift : -2.5

                return [0,1,2].map(m => {
                    const [R,G,B] = 
                        [0,1,2].map(q => 
                            50 + 
                            row * 10 + 
                            20 * ( 1 + Math.sin(twoThirdsPi * ((q+m+shift)/m) + (i/n) * TAU) )
                        |0)
                        .map(x => x + row*10)
                    return 'rgba(' +
                    [R * 1.85 + 40, G * 1.85 + 40, (B + 25)*1.3].join`,` + 
                    ',0.8)'
                })
            })

            for (let i = 0; i < nKeys; i++, keyNumber++) {

                const x = i * keyWidth
                
                this.keyConnectsTo[keyNumber] = null
                const gradient = this.ctx.createLinearGradient(x, rowHeight * row, x, rowHeight * (row+1))
                
                for (let z = 0; z > -12; z -= 1.1) {
                    gradient.addColorStop( PHI ** z, keycolor[keyNumber % n][Math.abs(z|0) % 3])
                }

                this.ctx.fillStyle = gradient
                this.ctx.beginPath()
                this.ctx.rect(x + margin, y + margin, keyWidth - 2*margin, rowHeight - 2*margin)
                this.ctx.fill()
                this.ctx.closePath()
                
            }
            keyNumber--
        })
    }

    
    toggleSidePanel() {
        clearTimeout(this.closeRequestId)
        const sidepanel = D('side-panel-container')
        const open = (this.panelOpen ^= 1)
        // D('open-panel').innerHTML = open ? '>>' : '<<'

        if (open)
            sidepanel.style.display = 'inline-block'
        sidepanel.style.width = open ? this.panelWidth * .86 * window.innerWidth : 0

        const paint = _ => {
            const desiredWDiv = 1 - this.panelWidth * open
            this.wDiv = desiredWDiv
            this.update()
        }
        if (!open) {
            this.closeRequestId = setTimeout(_ => {
                sidepanel.style.display = 'none'
            }, 200)
        }
        paint()
    }

    
    processCoordinateArray(coords, noteOn, noteOff) {
        const W = this.canvas.offsetWidth
        const H = this.canvas.height
        const presses = new Set()
        const xshift = 0.07 * window.innerWidth

        coords.forEach(t => {
            const x = (t.clientX - xshift) / W
            const y = t.clientY / H

            const keyNumber = noteOn(x,y)
            presses.add(keyNumber)
        })
        
        for (const i in this.keyConnectsTo) {
            if (!presses.has(+i)) {
                if (this.keyConnectsTo[i]) {
                    
                    noteOff(i)
                }
                this.keyConnectsTo[i] = null
            }
        }
    }
}