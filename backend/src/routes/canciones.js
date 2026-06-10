const express = require('express')
const router = express.Router()
const {
  getCanciones,
  getCancionById,
  createCancion,
  aprobarCancion
} = require('../controllers/cancionesController')

// GET /canciones
router.get('/', getCanciones)

// GET /canciones/:id
router.get('/:id', getCancionById)

// POST /canciones
router.post('/', createCancion)

// PATCH /canciones/:id/aprobar
router.patch('/:id/aprobar', aprobarCancion)

module.exports = router
