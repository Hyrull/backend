const Thing = require('../models/thing')


exports.createThing = (req, res, next) => {
  const thingObject = JSON.parse(req.body.thing)
  // On clean l'id et l'userId de la requête, et on prends plutôt l'userId du token de login, par sécurité
  delete thingObject._id
  delete thingObject._userId
  // Créatiion de l'objet et cette fois enregistrement de l'image
  const thing = new Thing({
    ...thingObject,
    useriD: req.auth.useriD,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
  })

  thing.save()
  .then(() => {req.status(201).json({message:'Objet enregistré !'})})
  .catch((err) => { res.status(400).json({err}) })
}

exports.modifyThing = (req, res) => {
  const thingObject = req.file ? {
    // Si y a une nouvelle image, on la regénère encore
    ...JSON.parse(req.body.thing),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    // Si on a pas déjà l'image : on la prends dans le body de la request
  } : { ...req.body }

  delete thingObject._userId
  Thing.findOne({_id: req.params.id})
  .then((thing) => {
    // Petit check que la personne modifie bien une image qui est la sienne : on confronte l'userId de l'objet à celui du token de la personne qui edit
    if (thing.useriD != req.auth.userId) {
      res.status(401).json({ message : 'Non autorisé' })
    } else {
      Thing.updateOne({_id: req.params.id}, {...thingObject, _id: req.params.id})
      .then(() => res.status(200).json({message : 'Réussi'}))
      .catch((err) => res.status(400).json({err}))
    }
  })
  .catch((err) => res.status(400).json({err}))
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