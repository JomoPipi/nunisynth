const propertyChildrenTypes = {
    frequency: [nodetypes.GAIN],
    detune: [nodetypes.GAIN],
    gain: [nodetypes.OSC, nodetypes.GAIN, nodetypes.FILTER],
    Q:  [nodetypes.OSC, nodetypes.GAIN, nodetypes.FILTER]
}

const isSourceNode = {
    [nodetypes.OSC]: true,
}

const typeTypes = {
    [nodetypes.OSC]: ['sine','triangle','square','sawtooth'],
    [nodetypes.FILTER]: ['lowpass','highpass','bandpass','notch','allpass']
}



for (const type of Object.values(nodetypes)) {

    const box = E('div')
    box.id = type + '-only-box'
    box.classList.add('node-properties')

    // TODO:
    // next child type (limit osc to have gain only as next child)
    // add connect to keyboard stuff

    if (typeTypes[type]) {
        const select = E('select')
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

    for (const prop of numericalControlProperties[type]) {
        const div = E('div')
        const textdiv = E('div')
        const nametext = E('span')
        const valuetext = E('input')
        const slider = E('input')
        const buttons = E('div')

        nametext.innerHTML = prop 

        valuetext.type = 'number'
        valuetext.classList.add('selectable')
        valuetext.style.width = 150
        valuetext.id = `${type}-${prop}-value`
        valuetext.oninput = function() {
            const value = +this.value
            slider.value = toSliderValue(value)
            G.selectedNode.setValueOf(prop, value)
        }

        slider.type = 'range'
        slider.min = 0
        slider.max = sliderConstant
        slider.step = 1e-9
        slider.id = `${type}-${prop}-slider`
        slider.oninput = function() {
            const value = toNodeValue(+this.value)
            valuetext.value = value
            G.selectedNode.setValueOf(prop, value)
        }
        
        
        for (const _type of propertyChildrenTypes[prop]) {
            const addChildBtn = E('button')
            addChildBtn.innerHTML = '+' + _type
            addChildBtn.onclick = function() {
                G.selectedNode.addChild(_type, G.selectedNode.audioNode[prop])
                G.update()
            }
            buttons.appendChild(addChildBtn)
        }
        const mappingsBtn = E('button')
        mappingsBtn.style.color='#aaa'
        mappingsBtn.style.backgroundColor='#444'
        mappingsBtn.innerHTML = 'MAPS'
        mappingsBtn.onclick = _ => toggleMappingsPage(prop)
        buttons.appendChild(mappingsBtn)


        textdiv.appendChild(nametext)
        textdiv.appendChild(valuetext)

        div.classList.add('column')
        
        ;[textdiv,slider,buttons].forEach(x =>
            div.appendChild(x))

        box.appendChild(div)
    }

    if (!isSourceNode[type]) {
        for (const _type of Object.values(nodetypes)) {

            const channelButton = E('button')
            channelButton.innerHTML = _type + ' input channel'
            channelButton.onclick = function() {
                G.selectedNode.addChild(_type, G.selectedNode.audioNode)
                G.update()
            }

            box.appendChild(channelButton)
        }
    } else {
        const connectBtn = E('button')
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

function toggleMappingsPage(prop) {
    const p = D('mappings-page')
    const text = D('y-axis-factor-text')
    D('mapping-type-text').innerHTML = prop + ' - mappings'
    if (p.style.display === 'none') {
        p.style.display = 'block'
        const slider = D('y-axis-factor')
        text.innerHTML = 
        slider.value = G.selectedNode[prop].yAxisFactor || 0 
        slider.oninput = function() {
            text.innerHTML = 
            G.selectedNode[prop].yAxisFactor = +this.value
        }
    } else {
        p.style.display = 'none'
    }
}