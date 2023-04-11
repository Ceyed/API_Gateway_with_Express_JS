const registry = require('../routes/registry.json')
const PORT = 3000

const auth = (req, res, next) => {
    const url = req.protocol + '://' + req.hostname + PORT + req.path
    const authString = Buffer.from(req.headers.authorization, 'base64').toString('utf-8')
    const authParts = authString.split(':')
    const username = authParts[0]
    const password = authParts[1]

    const user = registry.services.auth.users[username]
    if (user) {
        if (user.username === username && user.password === password) {
            next()
        }
        else {
            res.send({
                authenticated: false,
                path: url,
                message: `Authentication unsuccessful. Incorrect password`
            })
        }
    }
    else {
        res.send({
            authenticated: false,
            path: url,
            message: `Authentication unsuccessful. User ${username} does not exist`
        })
    }
}

module.exports = auth
