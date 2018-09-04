const crypto = require('crypto')

module.exports = function(password, key = "fengyu da shuai bi") {

    const hmac = crypto.createHmac("sha256", key)
    hmac.update(password)
    const passwordhmac = hmac.digest("hex")
    return passwordhmac
}