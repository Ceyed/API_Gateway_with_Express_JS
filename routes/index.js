const express = require('express')
const router = express.Router()
const axios = require('axios')
const registry = require('./registry.json')

router.all('/:apiName/:path', (req, res) => {
    console.log(req.params.apiName)
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

module.exports = router
