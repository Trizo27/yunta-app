const express = require('express')
const cors = require('cors')
require('dotenv').config()

const supabase = require('./config/supabase')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

// Ruta de prueba básica
app.get('/', (req, res) => {
  res.json({ message: '🎸 Yunta API funcionando' })
})

// Ruta de prueba de base de datos
// Intenta leer la tabla canciones para verificar la conexión
app.get('/test-db', async (req, res) => {
  const { data, error } = await supabase
    .from('canciones')
    .select('*')
    .limit(1)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ 
    message: '✅ Conexión a la base de datos exitosa',
    data 
  })
})

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
