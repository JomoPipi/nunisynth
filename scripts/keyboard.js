/*

A keyboard takes as input the user touch and outputs frequency values

*/




const TR2 = 2 ** (1.0 / 12.0)

const scaleSteps = [...Array(12)].reduce(a => 
    [2,2,1,2,2,2,1].reduce((b,v) => b.concat(v+b[b.length-1]), a)
, [0])



class Keyboard {
    constructor(canvas) {
        this.canvas = canvas
        this.ctx = canvas.getContext('2d')
        this.wDiv = this.hDiv = 1
        this.octaves = this.rows = 3
        this.kbMode = 'scale',
        this.panelOpen = 0
        this.panelWidth = .4
        this.NRT2 = TR2,
        this.notesPerOctave = 12
        this.divisionLinePercent = 1 // 0.65
        this.divisionLine = canvas.height * 0.65
        this.keyConnectsTo = {}
        this.lastRequestID = null
    }
    

    getFrequencyFactor(x) {
        const keyNumber = x * this.notesPerOctave * this.octaves | 0
        return (
            this.kbMode === 'chromatic' ?

                this.NRT2 ** keyNumber :

                TR2 ** scaleSteps[keyNumber])
    }

    
    _getFrequencyFactorAndKeyNumber(x) {
        const keyNumber = x * this.notesPerOctave * this.octaves | 0
        return [
            this.kbMode === 'chromatic' ?

                this.NRT2 ** keyNumber :

                TR2 ** scaleSteps[keyNumber]
            
            , keyNumber]
    }

    
    getFrequencyFactorsAndKeyNumber(x,y) {
        const row =  y * this.rows | 0
        const keysOnThisRow = this.keysOnEachRow[row]
        const column = keysOnThisRow * x | 0

        const keyNumber = [...Array(row)].reduce((a,_,r) => 
            a + this.keysOnEachRow[r] | 0, column)
        
        const vertFactor = this.rows * (y % (1.0 / this.rows)) 

        return [
            this.kbMode === 'chromatic' ?

                this.NRT2 ** keyNumber :

                TR2 ** scaleSteps[keyNumber]
            
            , 
            vertFactor,
            keyNumber
        ]
    }
    



    update() { 
        const W = this.canvas.width  = window.innerWidth  * this.wDiv
        const H = this.canvas.height = window.innerHeight * this.hDiv
        

        if (this.kbMode === 'scale') this.notesPerOctave = 7

        const range = this.octaves
        const n = this.notesPerOctave
        const keys = n * range
        
        this.keysOnEachRow = [...Array(this.rows)].map((_,r) => 
            (keys / this.rows | 0) + +(keys % this.rows > r))


        const keycolor = [...Array(n)].map((_,i) => {
            
            return [0,1,2].map(m => 
                'rgb(' +
                [0,1,2].map(q => 100 * (1 + Math.sin(twoThirdsPi * ((q+m)/m) + (i/n) * TAU)) |0).join`,` + 
                ')')
        })

        this.ctx.strokeStyle = 'white'
        this.ctx.lineWidth = 25 / (n * range)

        const rowHeight = H /this.rows
        
        let keyNumber = 0
        ;this.keysOnEachRow.forEach((nKeys,row) => {

            const keyWidth = W / nKeys
            const y = rowHeight * row

            for (let i = 0; i < nKeys; i++, keyNumber++) {

                const x = i * keyWidth
                
                this.keyConnectsTo[keyNumber] = null
                const gradient = this.ctx.createLinearGradient(x, rowHeight * row, x, rowHeight * (row+1))
                
                for (let z = 0; z > -12; z--)
                    gradient.addColorStop( PHI ** z, keycolor[keyNumber % n][Math.abs(z) % 3])

                this.ctx.fillStyle = gradient
                this.ctx.beginPath()
                this.ctx.rect(x, y, keyWidth, rowHeight)
                this.ctx.fill()
                this.ctx.stroke()
                this.ctx.closePath()
                
            }
        })
    }

    
    toggleSidePanel() {
        const open = (this.panelOpen ^= 1)
        const paint = _ => {
            const desiredWDiv = 1 - this.panelWidth * open
            const delta = (desiredWDiv - this.wDiv) / 4
            log(delta,desiredWDiv)
            if (Math.abs(delta) < 1e-4)
                this.wDiv = desiredWDiv
            else 
                this.wDiv += delta


            if (this.wDiv !== desiredWDiv) {
                window.cancelAnimationFrame(this.lastRequestID)
                this.lastRequestID = requestAnimationFrame(paint)
            }
            this.update()
            D('side-panel').style.display = open ? 'inline' : 'none'
        }
        paint()
    }

    
    processCoordinateArray(coords, noteOn, noteOff) {
        const W = this.canvas.width
        const H = this.canvas.height
        const presses = new Set()
        
        coords.forEach(t => {
            const x = t.clientX/W
            const y = t.clientY/H

            const keyNumber = noteOn(x,y)
            presses.add(keyNumber)
        })
        
        for (const i in this.keyConnectsTo) {
            if (!presses.has(+i)) {
                if (this.keyConnectsTo[i]) {
                    
                    noteOff(this.keyConnectsTo[i])
                }
                this.keyConnectsTo[i] = null
            }
        }
    }
}