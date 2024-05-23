const express = require('express')
const mongoose = require('mongoose');
const stuffRoutes = require('./routes/stuff')

const app = express()

mongoose.connect('mongodb+srv://xavierleonard:7G)_%403Xf_6uFmYw@cluster0.amsin0v.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('Connected to MongoDB!'))
  .catch((err) => console.log(`DB connection error:${err}`));


// Permet à Express de gérer les requêtes content-type JSON + met le body accessible dans req. (req.body)
app.use(express.json())

// Headers pour CORS
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
})

// call les fonctions dans stuff.js, avec url par défaut /api/stuff
app.use('/api/stuff', stuffRoutes)

module.exports = app