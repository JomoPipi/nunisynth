const C_NOTE = 130.81278265029934

const preset = G => {

    G.selectedNode = G.root
    G.deleteSelectedNode()
    
    return {
        0: _ => { // belly_bells
            ;[...Array(2)].reduce((a,_,n) =>
                a.addChild(nodetypes.FILTER, 'channel',
                {
                    values: { frequency: C_NOTE + 3 ** (4 + (n*3)/TAU), frequency_yAxisFactor: -2 },
                    doConnect: true

                }), G.root)

            G.root.children.forEach((c,n) =>  {
                
                c.addChild(nodetypes.GAIN, 'frequency',
                {
                    values: { gain: 300 * (n+1),  gain_yAxisFactor: 8 },
                })

                c.children[0]
                    .addChild(nodetypes.OSC, 'channel',
                    {
                        values: { 
                            frequency: 3 ** n, 
                            frequency_yAxisFactor: PHI,
                        },
                        doConnect: true,

                    })


                
                c.addChild(nodetypes.OSC, 'channel',
                {
                    values: { 
                        frequency: 2 ** (Math.log2(C_NOTE*2) + n * 3 /PHI),
                        frequency_auxAdsrVal: -0.5,
                    },
                    doConnect: true
                })
            })
            G.root.gain.yAxisFactor = 0.9
            G.update()
            ADSR.render()
            aux_ADSR.render()
            // debug,('g=',G.nodes.length)
        },
        1: _ => {
            ;[...Array(4)].reduce((a,_,n) =>
                a.addChild(nodetypes.OSC, 'channel',
                {
                    values: { frequency: 2 ** (Math.log2(C_NOTE*2) + n/PHI),
                        frequency_auxAdsrVal: 0.3,
                    },
                    doConnect: true
    
                }), G.root)
    
            G.root.children.forEach((c,n) =>  {
                
                c.addChild(nodetypes.GAIN, 'frequency',
                {
                    values: { 
                        gain: n * .5, 
                        gain_yAxisFactor: 7.5
                    },
                })
                c.children[0].addChild(nodetypes.OSC, 'channel',
                {
                    values: { frequency: 2 ** (n / TAU), frequency_yAxisFactor: TAU },
                    doConnect: true,
                })
            })
            G.root.setValueOf('gain', 0.12345)
            G.root.gain.yAxisFactor = 0.25
            aux_ADSR.attack = 0.0
            aux_ADSR.decay = 0.0
            G.update()
            ADSR.render()
            aux_ADSR.render()
            // debug('g=',G.nodes.length)
        },

        2: _ => {
            ;[...Array(4)].reduce((a,_,n,arr) =>
                a.addChild(nodetypes.FILTER, 'channel',
                {
                    values: { 
                        frequency: 2 ** (7 + n/(PHI+1)),
                        Q: n * (arr.length + 1) / 2.0,
                        frequency_yAxisFactor: n 
                    }
    
                }), G.root)
    
            G.root.children.forEach((c,n) =>  {
                c.audioNode.type = 'lowpass'
                c.addChild(nodetypes.OSC, 'channel',
                {
                    values: { frequency: PHI ** (11 + n/3.0) + n ** PHI },
                    doConnect: true
                })
                c.addChild(nodetypes.GAIN, 'frequency',
                {
                    values: { gain: 100 * n, gain_yAxisFactor: n },
                })
                c.children[1].addChild(nodetypes.OSC, 'channel',
                {
                    values: { frequency: PHI ** n, frequency_yAxisFactor: PHI },
                    doConnect: true,
                })
            })
            G.root.gain.yAxisFactor = PHI
            G.update()
            ADSR.render()
            aux_ADSR.render()
            // debug('g=',G.nodes.length)
        },
        
        3: _ => {
            ;[...Array(4)].reduce((a,_,n,arr) =>
                a.addChild(nodetypes.FILTER, 'channel',
                {
                    values: { 
                        frequency: 2 ** (7 + n/(PHI+1)),
                        Q: n * (arr.length + 1) / 2.0,
                        frequency_yAxisFactor: n 
                    }
    
                }), G.root)
    
            G.root.children.forEach((c,n) =>  {

                c.audioNode.type = 'highpass'
                c.addChild(nodetypes.OSC, 'channel',
                {
                    values: { frequency: 2 ** (7 + n/Math.E) + n ** PHI },
                    doConnect: true
                })
                c.addChild(nodetypes.GAIN, 'frequency',
                {
                    values: { gain: 100 * n, gain_yAxisFactor: n },
                })
                c.children[0].addChild(nodetypes.GAIN, 'frequency',
                {
                    values: { gain: (PHI) ** (n*2), frequency_yAxisFactor: TAU },
                })
                c.children[1].addChild(nodetypes.OSC, nodetypes.GAIN, 
                {
                    values: { frequency: PHI ** n, frequency_yAxisFactor: PHI },
                    doConnect: true,
                })
                
                ;(C => {
                    C.addChild(nodetypes.OSC, 'channel', {
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
        4: _ => {
            G.root.addChild(nodetypes.OSC,'channel',{
                values: { frequency: C_NOTE / 4.0, frequency_auxAdsrVal: 3, audioNodeType: 'triangle' },
                doConnect: true
            })
            .children[0].addChild(nodetypes.GAIN,'frequency',{
                values: { gain: 50, gain_yAxisFactor: 4, gain_auxAdsrVal: 3 }
            })
            .children[0].addChild(nodetypes.OSC,'channel',{
                values: { frequency: C_NOTE / 7.98, frequency_auxAdsrVal: 2, audioNodeType: 'sawtooth' },
                doConnect: true
            })

            aux_ADSR.attack = 0.013129376702863738
            aux_ADSR.decay = 0.24486140259274407
            ADSR.attack = 0.020416984558105469
            ADSR.decay = 0.00008349227905273
            ADSR.sustain = 0.9233901420913412
            ADSR.release = 0.0601858678519443

            G.update()
            ADSR.render()
            aux_ADSR.render()
            MY_JS_DIALS.forEach(d => d.render())
        },
        5: _ => { // techno
            let x = 0.01
            ;[...Array(3)].forEach((_,i) => {

                
                G.root

                .addChild(nodetypes.GAIN,'channel',{
                    values: { gain: x*10, gain_yAxisFactor: 0 },
                    doConnect: true
                })
                .addChild(nodetypes.GAIN,'channel',{
                    values: { gain: x+.1, gain_yAxisFactor: 0.9 },
                    doConnect: true
                })
                .addChild(nodetypes.GAIN,'channel',{
                    values: { gain: x+.2, gain_yAxisFactor: 0.9 },
                    doConnect: true
                })
                x += .01
                
            })

            G.root.children.forEach((c,i) => {
                
                c
                // .addChild(nodetypes.OSC,'channel',{
                //     values: { frequency: C_NOTE * 2 - i, frequency_auxAdsrVal: -3 },
                //     audioNodeType: 'sawtooth',
                //     doConnect: true
                // })
                .addChild(nodetypes.OSC,'channel',{
                    values: { 
                        frequency: C_NOTE * (2 ** (1/100.0)) ** i,
                        frequency_auxAdsrVal: i % 2 ? -i/9.0 : i/9.0,
                    },
                    audioNodeType: 'sawtooth',
                    doConnect: true
                })
                // .addChild(nodetypes.OSC,'channel',{
                //     values: { frequency: C_NOTE / 2.0 + i * 2, frequency_auxAdsrVal: 1 },
                //     audioNodeType: 'sawtooth',
                //     doConnect: true
                // })

            })


            G.root.setValueOf('gain', 0.1)

            aux_ADSR.attack = 0.0
            aux_ADSR.decay = 0.0
            ADSR.attack = 0.010416984558105469
            ADSR.decay = 0.00008349227905273
            ADSR.sustain = 0.9233901420913412
            ADSR.release = 0.1601858678519443

            G.update()
            ADSR.render()
            aux_ADSR.render()
            MY_JS_DIALS.forEach(d => d.render())
        },
        6: _ => { // big_trumpet
            G.root
            .addChild(nodetypes.FILTER,'channel',{
                values: { frequency: C_NOTE * 2, frequency_yAxisFactor: 0.5 },
                doConnect: true
            })
            .children[0]
            .addChild(nodetypes.OSC,'channel', {
                values: {frequency: C_NOTE * 2 },
                doConnect: true
            })
            .children[0]
            .addChild(nodetypes.GAIN,'frequency', {
                values: {gain: 76, gain_auxAdsrVal: 4 }
            })
            .children[0]
            .addChild(nodetypes.OSC,'channel', {
                values: { frequency: 37 },
                doConnect: true
            })
        
            aux_ADSR.attack = 0.083129376702863738
            aux_ADSR.decay = 0.99486140259274407
            ADSR.attack = 0.010416984558105469
            ADSR.decay = 0.00008349227905273
            ADSR.sustain = 0.9233901420913412
            ADSR.release = 0.2001858678519443
            
            G.root.setValueOf('gain', 0.2)
            G.root.gain.yAxisFactor = 0 
            G.update()
            ADSR.render()
            aux_ADSR.render()
            MY_JS_DIALS.forEach(d => d.render())
        },
    }
}
