const express = require('express')
const mongoose = require('mongoose');

const Thing = require('./models/thing')

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



// CRUD total ici. Create Read Update Delete.
// create: app.post
// read: app.get
// update: app.put
// delete: app.delete
// Ce sont des fonctions express (app est called au dessus en tant que tel)

// Réponds au POST sur /api/stuff (première ligne)
app.post('/api/stuff', (req, res, next) => {
  // On retire le _id car il est généré par mongoDB et donc pas correspondant à l'ID voulu
  delete req.body._id
  // '...req.body' est un raccourci pour dire req.body.title etc etc. ça prends tout
  const thing = new Thing({
    ...req.body
  })
  thing.save()
  .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
  .catch(err => res.status(400).json({ err }))
})

// Tout ce qui concerne la page /thing/:id. Donc la page de l'item
app.get('/api/stuff/:id', (req, res) => {
  // On compare le bon objet, là où le _id correspond au "id" du body de la requête (req.params.id)
  Thing.findOne({ _id: req.params.id })
    // On passe le "thing", code 200 et on passe le thing, tj en json
    .then(thing => res.status(200).json(thing))
    .catch(err => res.status(404).json({err}))
})

// Modification d'un objet
app.put('/api/stuff/:id', (req, res) => {
  Thing.updateOne({ _id: req.params.id}, {...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Objet modifié avec succès !' }))
    .catch(err => res.status(400).json({err}))
})

// Suppression d'un objet
app.delete('/api/stuff/:id', (req, res) => {
  Thing.deleteOne({ _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Thing supprimée' }))
    .catch(err => res.status(400).json({ err }))
})



// Réponds au GET sur /api/stuff (première ligne)
app.get('/api/stuff', (req, res) => {
  Thing.find()
  .then(things => res.status(200).json(things))
  .catch(err => res.status(400).json({err}))
})

module.exports = app