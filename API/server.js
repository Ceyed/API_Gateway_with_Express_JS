const express = require('express')
const app = express()
const PORT = 3001

app.use(express.json())

app.get('/test_api', (req, res, next) => {
    res.json('Hello from API service')
})

app.post('/foo', (req, res, next) => {
    res.json('foo func')
})

app.listen(PORT, () => {
    console.log(`API server is online on port ${PORT}`)
})
