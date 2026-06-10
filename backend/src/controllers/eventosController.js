const supabase = require('../config/supabase')

// Función auxiliar — calcula distancia entre dos coordenadas en kilómetros
// Usa la fórmula de Haversine
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Radio de la Tierra en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// GET /eventos — Devuelve eventos, opcionalmente filtrados por ubicación
// Parámetros opcionales: lat, lng, radio (en km, default 10)
// Ejemplo: GET /eventos?lat=-31.4167&lng=-64.1833&radio=5
const getEventos = async (req, res) => {
  const { lat, lng, radio = 10 } = req.query

  // Traemos todos los eventos futuros ordenados por fecha
  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .gte('fecha_inicio', new Date().toISOString()) // Solo eventos futuros
    .order('fecha_inicio', { ascending: true })

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  // Si el usuario manda su ubicación, filtramos por distancia
  if (lat && lng) {
    const eventosCercanos = data.filter(evento => {
      const distancia = calcularDistancia(
        parseFloat(lat),
        parseFloat(lng),
        parseFloat(evento.latitud),
        parseFloat(evento.longitud)
      )
      evento.distancia_km = Math.round(distancia * 10) / 10 // Redondeamos a 1 decimal
      return distancia <= parseFloat(radio)
    })

    // Ordenamos por distancia de menor a mayor
    eventosCercanos.sort((a, b) => a.distancia_km - b.distancia_km)

    return res.json({ data: eventosCercanos, total: eventosCercanos.length })
  }

  res.json({ data, total: data.length })
}

// GET /eventos/:id — Devuelve un evento por su ID con los asistentes
const getEventoById = async (req, res) => {
  const { id } = req.params

  const { data, error } = await supabase
    .from('eventos')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    return res.status(404).json({ error: 'Evento no encontrado' })
  }

  // Contamos cuántos confirmaron asistencia
  const { count } = await supabase
    .from('asistencias')
    .select('*', { count: 'exact', head: true })
    .eq('evento_id', id)

  res.json({ data: { ...data, total_asistentes: count } })
}

// POST /eventos — Crea un evento nuevo
const createEvento = async (req, res) => {
  const {
    titulo,
    descripcion,
    direccion,
    latitud,
    longitud,
    fecha_inicio,
    fecha_fin,
    entrada_libre,
    precio
  } = req.body

  // Validaciones básicas
  if (!titulo || !direccion || !latitud || !longitud || !fecha_inicio) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: titulo, direccion, latitud, longitud, fecha_inicio'
    })
  }

  const { data, error } = await supabase
    .from('eventos')
    .insert([{
      titulo,
      descripcion,
      direccion,
      latitud,
      longitud,
      fecha_inicio,
      fecha_fin,
      entrada_libre: entrada_libre ?? true,
      precio: entrada_libre ? null : precio
    }])
    .select()

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json({
    message: 'Evento creado exitosamente',
    data: data[0]
  })
}

// POST /eventos/:id/asistir — Confirma asistencia a un evento
const confirmarAsistencia = async (req, res) => {
  const { id } = req.params
  const { usuario_id } = req.body

  if (!usuario_id) {
    return res.status(400).json({ error: 'usuario_id es obligatorio' })
  }

  // Verificamos que el evento existe
  const { data: evento, error: eventoError } = await supabase
    .from('eventos')
    .select('id, titulo')
    .eq('id', id)
    .single()

  if (eventoError) {
    return res.status(404).json({ error: 'Evento no encontrado' })
  }

  // Insertamos la asistencia — si ya existe, la tabla tiene UNIQUE(usuario_id, evento_id)
  // así que Supabase devuelve error y lo manejamos
  const { data, error } = await supabase
    .from('asistencias')
    .insert([{ usuario_id, evento_id: id }])
    .select()

  if (error) {
    if (error.code === '23505') { // Código PostgreSQL de unique violation
      return res.status(409).json({ error: 'Ya confirmaste asistencia a este evento' })
    }
    return res.status(500).json({ error: error.message })
  }

  res.status(201).json({
    message: `Asistencia confirmada a "${evento.titulo}"`,
    data: data[0]
  })
}

// DELETE /eventos/:id/asistir — Cancela asistencia a un evento
const cancelarAsistencia = async (req, res) => {
  const { id } = req.params
  const { usuario_id } = req.body

  if (!usuario_id) {
    return res.status(400).json({ error: 'usuario_id es obligatorio' })
  }

  const { error } = await supabase
    .from('asistencias')
    .delete()
    .eq('evento_id', id)
    .eq('usuario_id', usuario_id)

  if (error) {
    return res.status(500).json({ error: error.message })
  }

  res.json({ message: 'Asistencia cancelada' })
}

module.exports = {
  getEventos,
  getEventoById,
  createEvento,
  confirmarAsistencia,
  cancelarAsistencia
}
