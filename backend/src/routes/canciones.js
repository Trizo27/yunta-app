const express = require('express')
const router = express.Router()
const {
  getCanciones,
  getCancionById,
  createCancion,
  aprobarCancion,
  getGeneros
} = require('../controllers/cancionesController')

// GET /canciones
router.get('/', getCanciones)

// GET /canciones/:id
router.get('/:id', getCancionById)

// POST /canciones
router.post('/', createCancion)

// PATCH /canciones/:id/aprobar
router.patch('/:id/aprobar', aprobarCancion)

router.get('/generos', getGeneros)

module.exports = router
