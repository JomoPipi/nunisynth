const preset = G => {

    G.selectedNode = G.root
    G.deleteSelectedNode()
    
    return {
        0: _ => {
            ;[...Array(2)].reduce((a,_,n) =>
                a.addChild(nodetypes.FILTER, 'channel',
                {
                    values: { frequency: 300 + 3 ** (4 + (n*3)/TAU), frequency_yAxisFactor: -8 },
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
                        values: { frequency: 3 ** n, frequency_yAxisFactor: PHI },
                        doConnect: true,

                    })


                
                c.addChild(nodetypes.OSC, 'channel',
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
                a.addChild(nodetypes.OSC, 'channel',
                {
                    values: { frequency: 2 ** (6 + n/PHI) },
                    doConnect: true
    
                }), G.root)
    
            G.root.children.forEach((c,n) =>  {
                
                c.addChild(nodetypes.GAIN, 'frequency',
                {
                    values: { gain: n * PHI, gain_yAxisFactor: 7.5 },
                })
                c.children[0].addChild(nodetypes.OSC, 'channel',
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
                values: { frequency: 40, frequency_auxAdsrVal: 3, audioNodeType: 'triangle' },
                doConnect: true
            })
            .children[0].addChild(nodetypes.GAIN,'frequency',{
                values: { gain: 50, gain_yAxisFactor: 4, gain_auxAdsrVal: 3 }
            })
            .children[0].addChild(nodetypes.OSC,'channel',{
                values: { frequency: 20, frequency_auxAdsrVal: 2, audioNodeType: 'sawtooth' },
                doConnect: true
            })

            aux_ADSR.attack = 0.013129376702863738
            aux_ADSR.decay = 0.24486140259274407
            ADSR.attack = 0.010416984558105469
            ADSR.decay = 0.00008349227905273
            ADSR.sustain = 0.9233901420913412
            ADSR.release = 0.1601858678519443

            ADSR.render()
            aux_ADSR.render()
            G.update()
        },
        5: _ => {
            ;[...Array(3)].forEach((_,i) => {

                G.root

                .addChild(nodetypes.OSC,'channel',{
                    values: { frequency: 280 - i, frequency_auxAdsrVal: -3 },
                    doConnect: true
                })
                .addChild(nodetypes.OSC,'channel',{
                    values: { frequency: 140 + i * 2, frequency_auxAdsrVal: -2 },
                    doConnect: true
                })
                .addChild(nodetypes.OSC,'channel',{
                    values: { frequency: 70 + i * 2, frequency_auxAdsrVal: 1 },
                    doConnect: true
                })
                // .children[0].addChild(nodetypes.GAIN, 'frequency', { 
                //     gain: 100, gain_yAxisFactor: 2 
                // })
                // .children[0].addChild(nodetypes.OSC,'channel',{
                //     values: { frequency: 70 + i, frequency_yAxisFactor: .75 },
                //     doConnect: true
                // })
                // .addChild(nodetypes.OSC,'gain',{
                //     values: { frequency: 8 + i, frequency_yAxisFactor: .75 },
                //     doConnect: true
                // })
            })

            aux_ADSR.attack = 0.013129376702863738
            aux_ADSR.decay = 0.09486140259274407
            ADSR.attack = 0.010416984558105469
            ADSR.decay = 0.00008349227905273
            ADSR.sustain = 0.9233901420913412
            ADSR.release = 0.1601858678519443

            ADSR.render()
            aux_ADSR.render()
            G.update()
        },
    }
}
