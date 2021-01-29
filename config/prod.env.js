var merge = require('webpack-merge')
let modeConfig = require(`./${process.env.modeName}/prod.conf.js`);
module.exports = merge({ NODE_ENV: '"production"' }, modeConfig)
