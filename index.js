
import express from 'express'
import bootstrap from './src/bootstrap.js'
import cors from 'cors'
const app = express()
app.use(cors())
const port = process.env.PORT ||3000
bootstrap(app,express)

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
