const signer = require('./signer')

const pubKey = 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA/eWj9OVpy0asyiYyx6iNsNJJXmY74yseIDJuh7dxoip+C+EmdQv3/OfZsT5NkVkSihoyBwJWCupsZjOzRqqdZv12OlHj03n/fbpbLgjSy4QqIA7GdfigDo40Cj6YAb5OxnC2phWBI45MX/RuW2BienUeIt2XLIaHsw2689ZdYiwxQy7050nn6I32bhOP86w9yx73nPpV5zLRRxsWznFAS20Mrn3dfsM8N0ucvaKeMbkncHIxgSCADcYLnWzojAhpdyvTtZxaLhXG+vkPo7sKez0bee61wHfcHgV9MI2j8gePLD30cN9t1JUvu/yPLdA3YhcllWAAcZ7+i5K9/mEJvQIDAQAB'
const keyPrefix = '-----BEGIN PUBLIC KEY-----\n'
const keySuffix = '\n-----END PUBLIC KEY-----'

const PUBLIC_KEY = keyPrefix + pubKey + keySuffix

let getPubKey = (appid) => {
  // TODO:
  return PUBLIC_KEY
}

let unpkg = (req, res, next) => {
  let pubKey = getPubKey(req.body.appid)
  let v = signer.verifySign(pubKey, req.body)
  if (v) {
    next()
  } else {
    next()
    // next(new Error('signature verify failed'))
  }
}

let pkg = (req, res, next) => {
  let resp = {
    appid: req.body.appid,
    version: req.body.version,
    type: req.body.type,
    target: req.body.target + '--resp',
    signType: req.body.signType,
    content: res.data
  }
  resp.sign = signer.sign(resp)
  res.data = resp
  next()
}

module.exports = {
  pkg,
  unpkg
}
