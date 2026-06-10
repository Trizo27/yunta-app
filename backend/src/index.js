const express = require('express')
const cors = require('cors')
require('dotenv').config()

const cancionesRouter = require('./routes/canciones')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Rutas
app.use('/canciones', cancionesRouter)

// Ruta base
app.get('/', (req, res) => {
  res.json({ message: '🎸 Yunta API funcionando' })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
