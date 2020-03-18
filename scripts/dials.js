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
        
        const imgDegreeOffset = 195
        this.render = _ => {
            dial.style.transform = `rotate(${this.value * 330 + imgDegreeOffset}deg)`
        }
        this.render()
    }
    
})()