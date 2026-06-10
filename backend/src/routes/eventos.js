const express = require('express')
const router = express.Router()
const {
  getEventos,
  getEventoById,
  createEvento,
  confirmarAsistencia,
  cancelarAsistencia
} = require('../controllers/eventosController')

// GET /eventos
router.get('/', getEventos)

// GET /eventos/:id
router.get('/:id', getEventoById)

// POST /eventos
router.post('/', createEvento)

// POST /eventos/:id/asistir
router.post('/:id/asistir', confirmarAsistencia)

// DELETE /eventos/:id/asistir
router.delete('/:id/asistir', cancelarAsistencia)

module.exports = router