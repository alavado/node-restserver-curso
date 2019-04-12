const express = require('express')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Usuario = require('../models/usuario')

const app = express()

app.post('/login', (req, res) => {
  let {email, password} = req.body
  Usuario.findOne({email}, (err, usuarioDB) => {
    if (err) {
      return res.status(500).json(err)
    }
    if (!usuarioDB) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o contraseña no encontrado'
        }
      })
    }
    if (!bcrypt.compareSync(password, usuarioDB.password)) {
      return res.status(400).json({
        ok: false,
        err: {
          message: 'Usuario o contraseña no encontrado'
        }
      })
    }
    let token = jwt.sign({
      usuario: usuarioDB
    }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN })
    res.json({
      ok: true,
      usuario: usuarioDB,
      token
    })
  })
})

module.exports = app
