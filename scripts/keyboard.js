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
        this.octaves = 2,
        this.kbMode = 'scale',
        this.surplus = 1.025,
        this.NRT2 = TR2,
        this.notesPerOctave = 12
        this.divisionLinePercent = 1 // 0.65
        this.divisionLine = canvas.height * 0.65
        this.keyConnectsTo = {}
    }
    

    getFrequencyFactor(x) {
        const keyNumber = x * this.notesPerOctave * this.octaves | 0
        return (
            this.kbMode === 'chromatic' ?

                this.NRT2 ** keyNumber :

                TR2 ** scaleSteps[keyNumber])
    }

    
    getFrequencyFactorAndKeyNumber(x) {
        const keyNumber = x * this.notesPerOctave * this.octaves | 0
        return [
            this.kbMode === 'chromatic' ?

                this.NRT2 ** keyNumber :

                TR2 ** scaleSteps[keyNumber]
            
            , keyNumber]
    }



    update() {
        
        const range = this.octaves
        const k = this.divisionLine = this.divisionLinePercent * H
        const scaleMode = this.kbMode === 'scale'
        const n = (this.notesPerOctave = scaleMode ? 7 : this.notesPerOctave) // updates this.notesPerOctave to 7 when needed
        
        
        const keycolor = [...Array(n)].map((_,i) => {
            
            return [0,1,2].map(m => 
                'rgb(' +
                [0,1,2].map(q => 100 * (1 + Math.sin(twoThirdsPi * ((q+m)/m) + (i/n) * TAU)) |0).join`,` + 
                ')')
        })

        this.ctx.strokeStyle = 'white'
        this.ctx.lineWidth = 25 / (n * range)

        for (let i = 0, count = 0; i <= range; i++) {

            const dx = (1/range) * W
            const [a,b] = [i * dx,(i+1) * dx]
            
            for (let j = 0; j < n; j++) {
    
                this.keyConnectsTo[count++] = null
                const gradient = this.ctx.createLinearGradient(a,0,a,k)
                this.ctx.createLinearGradient
                
                for (let z = 0; z > -12; z--)
                    gradient.addColorStop( PHI ** z, keycolor[j][Math.abs(z) % 3])

                this.ctx.fillStyle = gradient
                this.ctx.beginPath()
                this.ctx.rect(a + dx*j/n, 0, dx, k)
                this.ctx.fill()
                this.ctx.stroke()
                this.ctx.closePath()
            }
        }
    }
}

