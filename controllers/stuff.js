const Thing = require('../models/thing')



exports.createThing = (req, res, next) => {
  // On retire le _id car il est généré par mongoDB et donc pas correspondant à l'ID voulu
  delete req.body._id
  // '...req.body' est un raccourci pour dire req.body.title etc etc. ça prends tout
  const thing = new Thing({
    ...req.body
  })
  thing.save()
  .then(() => res.status(201).json({ message: 'Objet enregistré !'}))
  .catch(err => res.status(400).json({ err }))
}

exports.modifyThing = (req, res) => {
  Thing.updateOne({ _id: req.params.id}, {...req.body, _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Objet modifié avec succès !' }))
    .catch(err => res.status(400).json({err}))
}

exports.deleteThing = (req, res) => {
  Thing.deleteOne({ _id: req.params.id})
    .then(() => res.status(200).json({ message: 'Thing supprimée' }))
    .catch(err => res.status(400).json({ err }))
}

exports.getThings = (req, res) => {
  Thing.find()
  .then(things => res.status(200).json(things))
  .catch(err => res.status(400).json({err}))
}

exports.getOneThing = (req, res) => {
  // On compare le bon objet, là où le _id correspond au "id" du body de la requête (req.params.id)
  Thing.findOne({ _id: req.params.id })
    // On passe le "thing", code 200 et on passe le thing, tj en json
    .then(thing => res.status(200).json(thing))
    .catch(err => res.status(404).json({err}))
}