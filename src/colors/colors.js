const tinygradient = require('tinygradient')
const { GRADIENTS } = require('../variables/variables')

const roundingNumber = 3

const interpolateValue = (map, key) => {
    const value = map[key]
    const array = Object.values(map)
    const min = Math.min( ...array )
    const max = Math.max( ...array )
    const interpolated = parseFloat(((value - min) / (max - min)).toFixed(roundingNumber))
    if (interpolated > 1) interpolatedFixed = 1
    return interpolated
}

const getGradient = (gradientName) => {
    return tinygradient(GRADIENTS[gradientName])
}

const getColor = (gradient, percent) => {
    const color = '#' + gradient.rgbAt(percent).toHex()
    return color
}

const getColors = (categoryValues, categoryName) => {
    let colorValues = {}
    const gradient = getGradient(categoryName)
    Object.entries(categoryValues).forEach(([key, value]) => {
        const color = getColor(gradient, interpolateValue(categoryValues, key))
        colorValues[key] = color
    })
    colorValues['antarctida'] = getColor(gradient, 0)
    return colorValues
}

module.exports = {
    getColors,

};