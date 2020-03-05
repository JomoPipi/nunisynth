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
    }
    

    getFrequencyFactor(x) {
        const range = this.octaves
        return (
            this.kbMode === 'continuous' ?
                2 ** (1 + this.surplus * range * x) :

            this.kbMode === 'chromatic' ?
                this.NRT2 ** (x * this.notesPerOctave * range | 0) :
        

                TR2 ** scaleSteps[x * 7 * range | 0])
    }


    update() {

        const k = this.divisionLine = this.divisionLinePercent * H
        const continuousMode = this.kbMode === 'continuous'
        const scaleMode = this.kbMode === 'scale'
        const n = scaleMode ? 7 : this.notesPerOctave
        
        const keycolor = [...Array(n)].map((_,i) => {
            
            return [0,1,2].map(m => 
                'rgb(' +
                [0,1,2].map(q => 100 * (1 + Math.sin(twoThirdsPi * ((q+m)/m) + (i/n) * TAU)) |0).join`,` + 
                ')')
        })


        this.ctx.strokeStyle = 'white'
        this.ctx.lineWidth = 25 / (n * this.octaves)
        for (let i = 0; i <= this.octaves; i++) {
            const w = continuousMode ? W / this.surplus : W
            const dx = (1/this.octaves) * w
            const [a,b] = [i * dx,(i+1) * dx]
            
    
            if (continuousMode) {
                const gradient = this.ctx.createLinearGradient(a,0,b,0)

                gradient.addColorStop(0, 'orange')
                gradient.addColorStop(.5, 'blue')
                gradient.addColorStop(1, 'violet')

                this.ctx.fillStyle = gradient
                this.ctx.fillRect(a, 0, b, k)
            } else {
                for (let j = 0; j < n; j++) {
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
}

