const propertyChildrenTypes = {
    frequency: [nodetypes.GAIN],
    detune: [nodetypes.GAIN],
    gain: [nodetypes.OSC, nodetypes.GAIN, nodetypes.FILTER],
    Q: [nodetypes.OSC, nodetypes.GAIN, nodetypes.FILTER]
}

const hasFrequencyParam = {
    [nodetypes.OSC]: true,
    [nodetypes.FILTER]: true,
}
const supportsChannels = {
    [nodetypes.GAIN]: true,
    [nodetypes.FILTER]: true,
}

const typeTypes = {
    [nodetypes.OSC]: ['sine','triangle','square','sawtooth'],
    [nodetypes.FILTER]: ['lowpass','highpass','bandpass','notch','allpass']
}

const sliderConfig = {
    
}

const limitfactor = {
    frequency: 1,
    detune: 14.1666666666666666,
    gain: 2,
    Q: 17
}


for (const type of Object.values(nodetypes)) {

    const _E = x => {
        const e = document.createElement(x)
        e.classList.add('neumorph2')
        return e
    }

    const box = E('div')
    box.id = type + '-only-box'
    box.classList.add('node-properties')

    // TODO:
    // next child type (limit osc to have gain only as next child)
    // add connect to keyboard stuff

    if (typeTypes[type]) {
        const select = _E('select')
        select.id = 'type-select'
        for (const typetype of typeTypes[type]) {
            const op = E('option')
            op.innerHTML = op.value = typetype
            select.appendChild(op)
        }
        select.oninput = function() {
            G.selectedNode.audioNode.type = this.value
        }
        box.appendChild(select)
    }

    for (const audioParam of audioParamsOfType[type]) {

        const div = _E('div')
        div.classList.add('height100')
        const textdiv = E('div')
        const nametext = E('span')
        const valuetext = _E('input')
        const slider = _E('input')
        const buttons = _E('div')

        nametext.innerHTML = audioParam 

        valuetext.type = 'number'
        valuetext.classList.add('selectable')
        valuetext.style.width = 150
        valuetext.id = `${type}-${audioParam}-value`
        valuetext.oninput = function() {
            const value = +this.value
            slider.value = toSliderValue(value)
            G.selectedNode.setValueOf(audioParam, value)
        }

        slider.type = 'range'
        slider.min = 0
        slider.max = sliderConstant
        slider.step = 1e-9
        slider.id = `${type}-${audioParam}-slider`
        slider.oninput = function() {
            const value = toNodeValue(+this.value) / limitfactor[audioParam]
            valuetext.value = value
            G.selectedNode.setValueOf(audioParam, value)
        }
        
        
        for (const _type of propertyChildrenTypes[audioParam]) {
            const addChildBtn = _E('button')
            addChildBtn.innerHTML = '+' + _type
            addChildBtn.onclick = function() {
                G.selectedNode.addChild(_type, audioParam)
                G.update()
            }
            buttons.appendChild(addChildBtn)
        }
        const mappingsBtn = _E('button')
        mappingsBtn.style.color = '#FBB'
        mappingsBtn.innerHTML = 'keyboard MAPS'
        mappingsBtn.onclick = _ => toggleMappingsPage(audioParam)
        buttons.appendChild(mappingsBtn)


        textdiv.appendChild(nametext)
        textdiv.appendChild(valuetext)

        div.classList.add('column')
        
        ;[textdiv,slider,buttons].forEach(x =>
            div.appendChild(x))

        box.appendChild(div)
    }

    if (supportsChannels[type]) {
        const box2 = _E('div')
        box2.style.display='grid'
        box2.style.gridTemplateColumns = '1fr 1fr 1fr'
        for (const _type of Object.values(nodetypes)) {

            const channelButton = _E('button')
            channelButton.innerHTML = _type + ' input channel'
            channelButton.onclick = function() {
                G.selectedNode.addChild(_type, 'channel', { doConnect: _type === nodetypes.OSC })
                G.update()
            }

            box2.appendChild(channelButton)
        }
        box.appendChild(box2)
    }
    
    if (hasFrequencyParam[type]) {
        const connectBtn = _E('button')
        connectBtn.id = `${type}-kb-connect`
        connectBtn.innerHTML = "pitch with keyboard"
        connectBtn.onclick = function() {
            G.selectedNode.connectedToKeyboard ^= 1
            this.classList.toggle('selected')
        }

        box.appendChild(connectBtn)
    }

    D('osc-gain-filter').appendChild(box)
}

function toggleMappingsPage(audioParam) {
    const typetext = D('mapping-type-text')
    const p = D('mappings-page')
    const text = D('y-axis-factor-text')
    const auxtext = D('aux-adsr-text')
    const title = audioParam + ' - mappings'
    const differs = title !== typetext.innerHTML
    typetext.innerHTML = title
    if (differs || p.style.display === 'none') {
        p.style.display = 'block'

        const slider = D('y-axis-factor')
        text.innerHTML = 
        slider.value = G.selectedNode[audioParam].yAxisFactor || 0 
        slider.oninput = function() {
            text.innerHTML = 
            G.selectedNode[audioParam].yAxisFactor = +this.value
        }

        const auxval = D('aux-adsr-val')
        auxtext.innerHTML = auxval.value = G.selectedNode[audioParam].auxAdsrVal
        auxval.oninput = function() {
            auxtext.innerHTML = G.selectedNode[audioParam].auxAdsrVal = +this.value
        }

    } else {
        p.style.display = 'none'
    }
}