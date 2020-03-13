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
        this.octaves = this.rows = 3
        this.kbMode = 'scale',
        this.surplus = 1.025,
        this.NRT2 = TR2,
        this.notesPerOctave = 12
        this.divisionLinePercent = 1 // 0.65
        this.wDiv = 1
        this.hDiv = 1
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
        
        if (this.kbMode === 'scale') this.notesPerOctave = 7

        const range = this.octaves
        const k = this.divisionLine = this.divisionLinePercent * H
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




        // for (let i = 0, count = 0; i <= range; i++) {

        //     const dx = (1/range) * W
        //     const [a,b] = [i * dx,(i+1) * dx]
            
        //     for (let j = 0; j < n; j++) {
    
        //         this.keyConnectsTo[count++] = null
        //         const gradient = this.ctx.createLinearGradient(a,0,a,k)
                
        //         for (let z = 0; z > -12; z--)
        //             gradient.addColorStop( PHI ** z, keycolor[j][Math.abs(z) % 3])

        //         this.ctx.fillStyle = gradient
        //         this.ctx.beginPath()
        //         this.ctx.rect(a + dx*j/n, 0, dx, k)
        //         this.ctx.fill()
        //         this.ctx.stroke()
        //         this.ctx.closePath()
        //     }
        // }
    }
}

