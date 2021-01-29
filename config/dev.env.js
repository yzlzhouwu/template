var merge = require('webpack-merge')
var prodEnv = require('./prod.env')
var modeConfig = require(`./${process.env.modeName}/dev.conf.js`)

module.exports = merge(prodEnv, { NODE_ENV: '"development"', }, modeConfig)
