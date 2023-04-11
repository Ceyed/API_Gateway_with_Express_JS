const express = require('express')
const app = express()
const routes = require('./routes')
const helmet = require('helmet')
const auth = require('./middleware/auth.js')
const PORT = 3000

app.use(express.json())
app.use(helmet())
app.use(auth)
app.use('/', routes)

app.listen(PORT, () => {
    console.log(`Gateway has started on port ${PORT}`);
})
