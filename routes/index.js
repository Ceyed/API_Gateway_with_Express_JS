const express = require('express')
const router = express.Router()
const axios = require('axios')
const registry = require('./registry.json')
const fs = require('fs')

router.all('/:apiName/:path', (req, res) => {
    // console.log(req.params.apiName)
    // console.log(registry.services[req.params.apiName].url + req.params.path)
    if (registry.services[req.params.apiName]) {
        axios({
            method: req.method,
            headers: req.headers,
            url: registry.services[req.params.apiName].url + req.params.path,
            data: req.body
        }).then((response) => {
            res.send(response.data)
        })
    }
    else {
        res.send('API name doesn\'t exist')
    }
})

router.post('/register', (req, res) => {
    const registrationInfo = req.body
    registrationInfo.url = registrationInfo.protocol + '://' + registrationInfo.host + ':' + registrationInfo.port + '/'
    registry.services[registrationInfo.apiName] = { ...registrationInfo }

    fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
        if (error) {
            res.send(`Couldn't register '${registrationInfo.apiName}'\nERROR: ${error}\n`)
        }
        else {
            res.send(`Successfully registered '${registrationInfo.apiName}'\n`)
        }
    })
})

module.exports = router
