const express = require('express')
const router = express.Router()
const axios = require('axios')
const registry = require('./registry.json')
const fs = require('fs')
const loadbalancer = require('../util/loadbalancer')


router.post('/enable/:apiName', (req, res) => {
    const apiName = req.params.apiName
    const requestBody = req.body
    const instances = registry.services[apiName].instances
    const index = instances.findIndex((srv) => {
        return srv.url === requestBody.url
    })
    if (index == -1) {
        res.send({ status: "error", message: `Could not find '${requestBody.url}' for service '${apiName}` })
    }
    else {
        instances[index].enabled = requestBody.enabled
        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
            if (error) {
                res.send(`Couldn't enabled/disabled '${requestBody.url}' for service '${apiName}'\nERROR: ${error}\n`)
            }
            else {
                res.send(`Successfully enabled/disabled '${requestBody.url}'\n`)
            }
        })
    }
})

router.all('/:apiName/:path', (req, res) => {
    const service = registry.services[req.params.apiName]
    if (service) {
        if (!service.loadBalancerStrategy) {
            service.loadBalancerStrategy = 'ROUND_RUBIN'
            fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
                if (error) {
                    res.send(`Could't write loadBalanceStrategy`)
                }
            })
        }
        const newIndex = loadbalancer[service.loadBalancerStrategy](service)
        const url = service.instances[newIndex].url
        console.log(url)
        axios({
            method: req.method,
            headers: req.headers,
            url: url + req.params.path,
            data: req.body
        }).then((response) => {
            res.send(response.data)
        }).catch((error) => {
            // res.send({ error })
            res.send("")
        })
    }
    else {
        res.send('API name doesn\'t exist')
    }
})

router.post('/register', (req, res) => {
    const registrationInfo = req.body
    registrationInfo.url = registrationInfo.protocol + '://' + registrationInfo.host + ':' + registrationInfo.port + '/'

    if (apiAlreadyExists(registrationInfo)) {
        res.send(`Configuration already exists for ${registrationInfo.apiName} at ${registrationInfo.host + ':' + registrationInfo.port + '/'}`)
    }
    else {
        registry.services[registrationInfo.apiName].instances.push({ ...registrationInfo })

        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
            if (error) {
                res.send(`Couldn't register '${registrationInfo.apiName}'\nERROR: ${error}\n`)
            }
            else {
                res.send(`Successfully registered '${registrationInfo.apiName}'\n`)
            }
        })
    }
})

router.post('/unregister', (req, res) => {
    const registrationInfo = req.body
    if (apiAlreadyExists(registrationInfo)) {
        const index = registry.services[registrationInfo.apiName].instances.findIndex((instance) => {
            return registrationInfo.url === instance.url
        })
        registry.services[registrationInfo.apiName].instances.splice(index, 1)
        fs.writeFile('./routes/registry.json', JSON.stringify(registry), (error) => {
            if (error) {
                res.send(`Couldn't unregister '${registrationInfo.apiName}'\nERROR: ${error}\n`)
            }
            else {
                res.send(`Successfully unregistered '${registrationInfo.apiName}'\n`)
            }
        })
    }
    else {
        res.send(`Configuration does not exist for ${registrationInfo.apiName} at ${registrationInfo.host + ':' + registrationInfo.port + '/'}`)
    }

})

const apiAlreadyExists = (registrationInfo) => {
    let exists = false
    registry.services[registrationInfo.apiName].instances.forEach(instance => {
        if (instance.url === registrationInfo.url) {
            exists = true
            return
        }
        else {
            console.log((instance.url, registrationInfo.url))
        }
    })
    return exists
}

module.exports = router
