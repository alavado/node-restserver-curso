const express = require('express')
const app = express()
const Usuario = require('../models/usuario')
const bcrypt = require('bcrypt')
const _ = require('lodash')
const { verificarToken, verificarAdminRole } = require('../middlewares/autenticacion')

app.get('/usuario', verificarToken, function (req, res) {

  let desde = Number(req.query.desde) || 0
  let cuantos = Number(req.query.cuantos) || 5
  Usuario.find({estado: true}, 'nombre email role estado google img')
    .skip(desde)
    .limit(cuantos)
    .exec((err, usuarios) => {
      if (err) {
        return res.status(400).json({
          ok: false,
          err
        })
      }
      Usuario.count({estado: true}, (err, total) => {
        res.json({
          ok: true,
          total,
          usuarios
        })
      })
    })
})

app.post('/usuario', [verificarToken, verificarAdminRole],  function (req, res) {
  let body = req.body

  let usuario = new Usuario({
    nombre: body.nombre,
    email: body.email,
    password: bcrypt.hashSync(body.password, 10),
    role: body.role
  })

  usuario.save((err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    res.json(usuarioDB)
  })
})

app.put('/usuario/:id', [verificarToken, verificarAdminRole], function (req, res) {
  let id = req.params.id
  let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado'])
  
  Usuario.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true
  }, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
})

app.delete('/usuario/:id', [verificarToken, verificarAdminRole], function (req, res) {
  let id = req.params.id
  Usuario.findByIdAndUpdate(id, {estado: false}, (err, usuarioDB) => {
    if (err) {
      return res.status(400).json({
        ok: false,
        err
      })
    }
    if (!usuarioDB || !usuarioDB.estado) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario no encontrado'
        }
      })
    }
    res.json({
      ok: true,
      usuario: usuarioDB
    })
  })
})

module.exports = app
