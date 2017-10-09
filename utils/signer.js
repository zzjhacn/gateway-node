const crypto = require('crypto')

const privateKey = `MIIEpAIBAAKCAQEAqcFHDItnH3sL4waKLudeRysY5dlAmCR/6/aO5TTIlaZRsngO/vafhgbUKvcAilgbBTKjrMo6PX3xKV8hygY7hw1tZfRvEzAv+Xgrn/8Nrs1OSPZKAtuEglzvSlqvev78QmqIjqIGNN3Rm45Ni6v/SuJ3MkorJm1bOEOSzvU+dYkVPB8MKIcYxsvW6IqBLn2sMCP5ir2aLHHonRWSTHZU2i/b3qZc6Oco+nunebGMEk0iQhX0ES3cW0gIH9Elw8bdX7orytDgflGURxajW66V24iauTSdTrwpwYuW3JPnacDysiBrQWGVMwusbcQ7TanI/Stf5Vo6eyNlORCrE6DC7QIDAQABAoIBAQCUknvrp8q+y8PQlDW27XsfUMH+0ZFuV2u6itXwF62DBMk2KUv+rL1b4Xgqjnpjms8zUmncXjZxAVxj+EYreh75ia/47uGUarViY2HTK7i/CCN/SkfmjlhAfLRWYF57iNYiDvmr1HUYKhg9TGPkXcoXsXPfiPiRLl8LNGE2T4C1/rKARF1kHbnSBFOxuRmBKDvYfGHaCLs50SiJBEKHr7lyVrlmDAuOe07Q5AIA8R/jzXbMa4gY0Td5SRxV74/jtrQfWJ+CLSsYF0LMtF/tq5MVIj1EcETy7pZEm/JvjcNVYa+YPVGYd2ll9I7u2Eo3+eVv9EWWwsQhwd6HXT1rMuyhAoGBANekh+Y/msSTaXXxM8S1xZPEowhR5+y3Jui6waF8dPLFpsob1Z4mO4fnTZben+/KgkyXiLaSbQqY5m1jGnXl1C4i3uTBW/cjxGIyh4Z7XhAZkImIKOz/XBPk8EgNV1iKwKWSzGwRDuIk0zY05Ybi3kL+y2SIl0Sa5yZsrknlU7Z5AoGBAMmGQr9hhmerhHOWCOqQxH+WDvmcXliUor9R4Ua5K8OpW3rUCoNYVTDPCtQ6mREdxBoAZNQujLBYnbu3BgrAsImRm5t3deoexoHL1O0xK60UPZ5ciCnRS1gqOm+H5tJ0mIwY6RjSR9iCJnZpigxMmyDDCgB/zxCd2LCREgthQmMVAoGAYotIo1q7oktvLTutmZ4rjQyWKE4tu0ozWLVHmUFjvDHAt6mipCP6nm+AUIqp8g3MH648BprBg889tg1M4UXHAdJjo4wNN9I7g1huAHHOGXNlTsRPV4aWkGzVtUeLe+XkhYWhL11YPNXxQ1tG7K4uPdVsIyQcZHiZW0DdIN3QtJkCgYA7rEPrg6dW31TzHQQ64O8ukHKSuxi8xhaC7G32kTJCV828yzjpt6hSMZyVR1y30saUpHU21ynVtgfO490oJfKgabtYB8Gkt8Qz/vVn3t19/LZaRDAVoeHbk3WGPQm+W8QoB+BN90ZK+A8HlSzJg42T3+0ARNg9pV/auLpNIFmWGQKBgQCNx4nNl57H/Ixa0ToACkleNnZM1kEaCYRWSPJ1aNMdfE0ypBS69fGAo7EUnWK0GGIsko7RLpgr5Gfd0Yws05o2qt6g2hFZw9Rt8aeOhfBiJw07Q/x+yQGFhQvwkZ7I7ThayDiXvGwycOD9VPiic6eCIzpcY34voY8ReMTCTLKIWw==`
const keyPrefix = '-----BEGIN RSA PRIVATE KEY-----\n'
const keySuffix = '\n-----END RSA PRIVATE KEY-----'

const PRIVATE_KEY = keyPrefix + privateKey + keySuffix

let sign = (obj) => {
  let str = extractSignStr(obj)
  let s = crypto.createSign('RSA-SHA256')
  s.update(str)
  return s.sign(PRIVATE_KEY, 'base64')
}

let verifySign = (publicKey, obj) => {
  let str = extractSignStr(obj)
  let v = crypto.createVerify('RSA-SHA256')
  v.update(str)
  return v.verify(publicKey, obj.sign)
}

let extractSignStr = (obj) => {
  // TODO:
  return 'TEST MESSAGE'
}

module.exports = {
  sign,
  verifySign
}
