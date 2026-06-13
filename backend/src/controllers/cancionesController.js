const supabase = require('../config/supabase')

// GET /canciones — Devuelve todas las canciones aprobadas
const getCanciones = async (req, res) => {
  // req.query permite filtrar por género si se pasa como parámetro
  // Ejemplo: GET /canciones?genero=zamba
  const { genero } = req.query

  let query = supabase
    .from('canciones')
    .select('*')
    .eq('aprobado', true)
    .order('titulo', { ascending: true })

  // Si viene un filtro de género lo aplicamos
  if (genero) {
    query = query.eq('genero', genero)
  }

  const { data, error } = await query

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ data, total: data.length })
}

// GET /canciones/:id — Devuelve una canción por su ID
const getCancionById = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('canciones')
    .select('*')
    .eq('id', id)
    .single() // Esperamos un solo resultado

  if (error) {
    return res.status(404).json({ error: 'Canción no encontrada' })
  }

  res.json({ data })
}

// POST /canciones — Crea una canción nueva (pendiente de aprobación)
const createCancion = async (req, res) => {
  // Extraemos los campos del body de la petición
  const { titulo, artista, genero, tono_original, letra, acordes } = req.body

  // Validación básica — título es obligatorio
  if (!titulo) {
    return res.status(400).json({ error: 'El título es obligatorio' })
  }

  const { data, error } = await supabase
    .from('canciones')
    .insert([{
      titulo,
      artista,
      genero,
      tono_original,
      letra,
      acordes,
      aprobado: false // Toda canción nueva empieza sin aprobar
    }])
    .select() // Devuelve el registro creado

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json({ 
    message: 'Canción creada, pendiente de aprobación',
    data: data[0] 
  })
}

// PATCH /canciones/:id/aprobar — Aprueba una canción (solo admin)
const aprobarCancion = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('canciones')
    .update({ aprobado: true })
    .eq('id', id)
    .select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ 
    message: 'Canción aprobada exitosamente',
    data: data[0] 
  })
}

// GET /canciones/generos — Devuelve los géneros disponibles en la base de datos
const getGeneros = async (req, res) => {
  const { data, error } = await supabase
    .from('canciones')
    .select('genero')
    .eq('aprobado', true)
    .not('genero', 'is', null)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // Extraemos géneros únicos
  const generosUnicos = [...new Set(data.map(c => c.genero))]
  res.json({ data: generosUnicos })
}

module.exports = { getCanciones, getCancionById, createCancion, aprobarCancion, getGeneros }
