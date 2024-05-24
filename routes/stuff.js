const express = require('express')
const auth = require('../middlewares/auth');
const router = express.Router()

const stuffCtrl = require('../controllers/stuff')

// CRUD total ici. Create Read Update Delete.
// create: app.post
// read: app.get
// update: app.put
// delete: app.delete
// Ce sont des fonctions express (app est called au dessus en tant que tel)

// Créer un nouvel item
router.post('/', auth, stuffCtrl.createThing)

// Tout ce qui concerne la page /thing/:id. Donc la page de l'item
router.get('/:id', auth, stuffCtrl.getOneThing)

// Modification d'un objet
router.put('/:id', auth, stuffCtrl.modifyThing)

// Suppression d'un objet
router.delete('/:id', auth, stuffCtrl.deleteThing)

// Get la page de base
router.get('/', auth, stuffCtrl.getThings)

module.exports = router