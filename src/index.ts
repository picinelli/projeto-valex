import express from "express"
import "express-async-errors"
import cors from "cors"

const app = express()
app.use(express.json())
app.use(cors)


app.listen(process.env.PORT || 5000, () => {
  console.log(`Servidor ligado :)`)
})