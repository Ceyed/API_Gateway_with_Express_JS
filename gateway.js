const express = require('express')
const app = express()
const routes = require('./routes')
const helmet = require('helmet')
const registry = require('./routes/registry.json')
const PORT = 3000

app.use(express.json())
app.use(helmet())

const auth = (req, res, next) => {
    const url = req.protocol + '://' + req.host + PORT + req.path
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

app.use(auth)
app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Gateway has started on port ${PORT}`);
})
