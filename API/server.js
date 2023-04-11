const express = require('express')
const app = express()
const axios = require('axios')

const HOST = 'http://localhost'
const PORT = 3002

app.use(express.json())

app.get('/test_api', (req, res, next) => {
    res.json('Hello from API service')
})

app.post('/foo', (req, res, next) => {
    res.json('foo func')
})

app.listen(PORT, () => {
    axios({
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        url: 'http://localhost:3000/register',
        data: {
            apiName: "testapi",
            host: HOST,
            port: PORT,
            url: HOST + ':' + PORT + '/'
        }
    }).then((response) => {
        console.log(response.data)
    })
    console.log(`API server is online on port ${PORT}`)
})
