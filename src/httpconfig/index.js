const httpconfig = require.context('./', false, /\.js$/)
const httpconfigs = {}
httpconfig.keys().forEach(api => {
  const config = httpconfig(api);
  Object.assign(httpconfigs, config.default || config)
})
export default httpconfigs
