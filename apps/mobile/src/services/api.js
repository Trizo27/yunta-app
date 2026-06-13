// Dirección de nuestro backend
// En desarrollo usamos la IP local de la Mac, no localhost
// porque el celular no conoce "localhost" de la Mac
const BASE_URL = 'http://192.168.100.197:3000'

// ── CANCIONES ──────────────────────────────────────

// Trae todas las canciones aprobadas, opcionalmente filtradas por género
export const getCanciones = async (genero = null) => {
  const url = genero
    ? `${BASE_URL}/canciones?genero=${genero}`
    : `${BASE_URL}/canciones`

  const response = await fetch(url)
  const data = await response.json()
  return data
}

// Trae una canción por su ID
export const getCancionById = async (id) => {
  const response = await fetch(`${BASE_URL}/canciones/${id}`)
  const data = await response.json()
  return data
}

// ── EVENTOS ────────────────────────────────────────

// Trae eventos cercanos según ubicación del usuario
// lat y lng son las coordenadas del celular
export const getEventos = async (lat = null, lng = null, radio = 10) => {
  const url = lat && lng
    ? `${BASE_URL}/eventos?lat=${lat}&lng=${lng}&radio=${radio}`
    : `${BASE_URL}/eventos`

  const response = await fetch(url)
  const data = await response.json()
  return data
}

// Trae un evento por su ID
export const getEventoById = async (id) => {
  const response = await fetch(`${BASE_URL}/eventos/${id}`)
  const data = await response.json()
  return data
}

// Confirma asistencia a un evento
export const confirmarAsistencia = async (eventoId, usuarioId) => {
  const response = await fetch(`${BASE_URL}/eventos/${eventoId}/asistir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ usuario_id: usuarioId })
  })
  const data = await response.json()
  return data
}

// Trae los géneros disponibles desde la base de datos
export const getGeneros = async () => {
  const response = await fetch(`${BASE_URL}/canciones/generos`)
  const data = await response.json()
  return data
}
