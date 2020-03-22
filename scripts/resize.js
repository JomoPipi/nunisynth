'use strict'


window.addEventListener('resize', resizeHandler)
window.addEventListener('orientationchange', resizeHandler)

function resizeHandler() {
    
    if (FORCE_LANDSCAPE.wasTouched) {

        FORCE_LANDSCAPE.style.display = 
            window.innerWidth < window.innerHeight ? 'block' : 'none'


        if (!FORCE_LANDSCAPE.wasTouchedOnce) {


            FORCE_LANDSCAPE.innerHTML = 
            `
                <p style='position:absolute;top:0;font-size:1em'>
                    <del> use your mobile device in landscape mode </del>
                    
                    <br>
                    <br>
                    
                    consider 
                    <a href="https://www.youtube.com/watch?v=Hz4b2exn16M&fbclid=IwAR3gtBx2vC5o24K-UadWZa-fRThgn0NZVdRckVjafcZ1vIzip3gG1qJ6lLc"
                    > checking out my sponsor!!
                    </a> 😍


                </p>
    
                <span style='position:absolute;bottom:5%;font-size:2em'>
                    Nuni 
                    <p>
                        version 0.1
                    </p>
                </span>
            `
            
            FORCE_LANDSCAPE.classList.add('start-screen-after')

            FORCE_LANDSCAPE.wasTouchedOnce = true
            
        }

    }
    KB.toggleSidePanel()

    KB.update()
    G.update()
}
resizeHandler()