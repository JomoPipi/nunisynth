const preset = G => {

    G.selectedNode = G.root
    G.deleteSelectedNode()
    
    return {
        0: _ => {
            ;[...Array(2)].reduce((a,_,n) =>
                a.addChild('filter', 'channel',
                {
                    values: { frequency: 300 + 3 ** (4 + (n*3)/TAU), frequency_yAxisFactor: -8 },
                    doConnect: true

                }), G.root)

            G.root.children.forEach((c,n) =>  {
                
                c.addChild('gain', 'frequency',
                {
                    values: { gain: 300 * (n+1),  gain_yAxisFactor: 8 },
                })

                c.children[0]
                    .addChild('oscillator', 'channel',
                    {
                        values: { frequency: 3 ** n, frequency_yAxisFactor: PHI },
                        doConnect: true,

                    })


                
                c.addChild('oscillator', 'channel',
                {
                    values: { frequency: 2 ** (8 + n * 3 /PHI) },
                    doConnect: true
                })
            })
            G.root.gain.yAxisFactor = 0.9
            G.update()
            // debug,('g=',G.nodes.length)
        },
        1: _ => {
            ;[...Array(5)].reduce((a,_,n) =>
                a.addChild('oscillator', 'channel',
                {
                    values: { frequency: 2 ** (6 + n/PHI) },
                    doConnect: true
    
                }), G.root)
    
            G.root.children.forEach((c,n) =>  {
                
                c.addChild('gain', 'frequency',
                {
                    values: { gain: n * PHI, gain_yAxisFactor: 7.5 },
                })
                c.children[0].addChild('oscillator', 'channel',
                {
                    values: { frequency: 2 ** (n / TAU), frequency_yAxisFactor: TAU },
                    doConnect: true,
                })
            })
            G.root.gain.yAxisFactor = 0.25
            G.update()
            // debug('g=',G.nodes.length)
        },

        2: _ => {
            ;[...Array(4)].reduce((a,_,n,arr) =>
                a.addChild('filter', 'channel',
                {
                    values: { 
                        frequency: 2 ** (7 + n/(PHI+1)),
                        Q: n * (arr.length + 1) / 2.0,
                        frequency_yAxisFactor: n 
                    }
    
                }), G.root)
    
            G.root.children.forEach((c,n) =>  {
                c.audioNode.type = 'lowpass'
                c.addChild('oscillator', 'channel',
                {
                    values: { frequency: PHI ** (11 + n/3.0) + n ** PHI },
                    doConnect: true
                })
                c.addChild('gain', 'frequency',
                {
                    values: { gain: 100 * n, gain_yAxisFactor: n },
                })
                c.children[1].addChild('oscillator', 'channel',
                {
                    values: { frequency: PHI ** n, frequency_yAxisFactor: PHI },
                    doConnect: true,
                })
            })
            G.root.gain.yAxisFactor = PHI
            G.update()
            // debug('g=',G.nodes.length)
        },
        
        3: _ => {
            ;[...Array(4)].reduce((a,_,n,arr) =>
                a.addChild('filter', 'channel',
                {
                    values: { 
                        frequency: 2 ** (7 + n/(PHI+1)),
                        Q: n * (arr.length + 1) / 2.0,
                        frequency_yAxisFactor: n 
                    }
    
                }), G.root)
    
            G.root.children.forEach((c,n) =>  {

                c.audioNode.type = 'highpass'
                c.addChild('oscillator', 'channel',
                {
                    values: { frequency: 2 ** (7 + n/Math.E) + n ** PHI },
                    doConnect: true
                })
                c.addChild('gain', 'frequency',
                {
                    values: { gain: 100 * n, gain_yAxisFactor: n },
                })
                c.children[0].addChild('gain', 'frequency',
                {
                    values: { gain: (PHI) ** (n*2), frequency_yAxisFactor: TAU },
                })
                c.children[1].addChild('oscillator', 'gain', 
                {
                    values: { frequency: PHI ** n, frequency_yAxisFactor: PHI },
                    doConnect: true,
                })
                
                ;(C => {
                    C.addChild('oscillator', 'channel', {
                        values: { frequency: 2 ** (2 + n/2.0) + n ** PHI },
                        doConnect: true,
                    })  
                    C.children[0].audioNode.type = 'sawtooth'
                })
                    (c.children[0].children[0])
                
                    c.children[0].audioNode.type = 'triangle'
            })
            G.root.gain.yAxisFactor = PHI
            G.update()
            // debug('g=',G.nodes.length)
        },
    }
}

// ;[0,1,2,3].forEach(n => {
//     const btn = E('button')
//     btn.innerHTML = 'preset ' + n
//     btn.classList.add('neumorph')
//     btn.onclick = _ => {
//         confirm('Your graph will be erased') &&
//             preset(G)[n]()
//     }
//     D('presets').appendChild(btn)
// })