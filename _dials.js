const MY_JS_DIALS = (_ => {

    return [...document.querySelectorAll('.js-dial')].map(dial => new JsDial(dial))
    
    function JsDial(dial) {
        this.isActive = false
        this.lastY = null
        this.max = 1
        this.value = this.min = this.sensitivity = 2**-7
        ;(xs => {
            for (const attr of xs) {
                this[attr.name] = (x => isNaN(+x) ? x : +x)(attr.value)
            }
        })(dial.attributes)
    
        this.attach = (func,startFunc,endFunc) => {
    
            const start = y => { 
                this.lastY = y
                this.isActive = true
                startFunc()
            }
            const end = _ => { 
                this.isActive = false
                endFunc()
            }
            const touchStart = e => start(e.touches[0].clientY)
            const mouseStart = e => start(e.clientY)
            const touchMove = e => move(e.touches[0].clientY)
            const mouseMove = e => move(e.clientY)
            
            const move = y => {
                if (!this.isActive) return;
    
                this.value += (this.lastY - y) * this.sensitivity
                this.value = Math.max(this.min, Math.min(this.max, this.value))
                this.lastY = y
    
                this.render()
                func(this.value)
            }
    
            dial.addEventListener('mousedown', mouseStart)
            dial.addEventListener('touchstart',touchStart)
    
            dial.addEventListener('touchmove', touchMove)
            window.addEventListener('mousemove', mouseMove)
    
            window.addEventListener('mouseup', end)
            window.addEventListener('touchend', end)
        }
    
        const ctx = dial.getContext('2d')
        const N = Math.min(dial.width,dial.height)
        const radius =  N/2
        const pi2 = Math.PI / 2.0
        const z = 10.0
        const piN = Math.PI / z
        const arcRange = value => {
            return 2 * ((z-1)/z) * Math.PI * (value - this.min) / (this.max - this.min)
        }

        this.render = _ => {
            ctx.fillStyle = '#AAB'
            ctx.strokeStyle = 'blue'
            ctx.lineWidth = 5

            ctx.clearRect(0,0,N,N)

            ctx.beginPath()
            ctx.arc(N/2, N/2, radius, 0, 7)
            ctx.fill()
            
            const pos = arcRange(this.value) + pi2 + piN
            
            ctx.beginPath()
            ctx.arc(N/2, N/2, radius, pos, pos, true)
            ctx.lineTo(N/2, N/2)
            ctx.stroke()
            ctx.closePath()
        }
        this.render()
    }
    
})()