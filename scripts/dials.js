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
    
            const start = (x,y) => { 
                this.lastX = x
                this.lastY = y
                this.isActive = true
                startFunc && startFunc()
            }
            const end = _ => { 
                this.isActive = false
                endFunc && endFunc()
            }
            const touchStart = e => start(e.touches[0].clientX,e.touches[0].clientY)
            const mouseStart = e => start(e.clientX,e.clientY)
            const touchMove = e => move(e.touches[0].clientX,e.touches[0].clientY)
            const mouseMove = e => move(e.clientX,e.clientY)
            
            const move = (x,y) => {
                if (!this.isActive) return;
    
                this.value += (this.lastY - y + x - this.lastX) * this.sensitivity
                this.value = Math.max(this.min, Math.min(this.max, this.value))
                this.lastX = x
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
            dial.style.transform = `rotate(${this.value * 320 + imgDegreeOffset}deg)`
        }
        this.render()
    }
    
})()