const ADSR = {
    attack: 0.010416984558105469, 
    decay: 0.17708349227905273, 
    sustain: 0.2166603088378906, 
    release: 0.4812504768371582
}
{
    ADSR.canvas = document.getElementById('adsr-visual')
    const ctx = ADSR.canvas.getContext('2d')
    
    ADSR.render = function () {
        const H = this.canvas.height, W = this.canvas.width
        ctx.lineWidth = 5
        ctx.strokeStyle = 'black'


        const sum = this.attack + this.decay + 0.25 + this.release
        const adsrWidths = [
            this.attack  / sum,
            this.decay   / sum,
            0.25         / sum,
            // release is done by default
        ]
        const [aw,dw,sw] = adsrWidths

        const t1 = aw
        const t2 = t1 + dw
        const t3 = t2 + sw
        const t4 = 1
        const margin = 20

        ctx.clearRect(0,0,W,H)
        let lastX = margin, lastY = H - margin
        ;[
            [t1, 0],
            [t2, 1 - this.sustain],
            [t3, 1 - this.sustain],
            [t4, 1]
        ].forEach(([x,y],i) => {
            ctx.beginPath()
            ctx.moveTo(lastX, lastY)
            ctx.strokeStyle = 'limegreen,red,blue,purple'.split`,`[i]
            ctx.lineTo(
                lastX = x * (W - margin * 2) + margin, 
                lastY = y * (H - margin * 2) + margin 
            )
            ctx.stroke()
            ctx.closePath()
        })
        ctx.closePath()
    }
    ADSR.render()
}