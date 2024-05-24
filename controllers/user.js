const bcrypt = require('bcrypt')
const User = require('../models/user')



exports.signup = (req, res, next) => {
// Ce qui permet à bcrypt (librairie pour créer le hash du PW) de hash. 10 = 10 tour d'encryption (suffisant)
  bcrypt.hash(req.body.password, 10)
    .then(hash => {
      // On ajoute un User à la db. on garde l'email tel quel, et le pw on prends le hash!!!! pas en dur!!!
      const user = new User({
        email: req.body.email,
        password: hash
      })
      user.save()
      .then(() => res.status(201).json({ message: 'Utilisateur créé' })) // 201 = Ressource créée
      .catch(error => res.status(500).json({ error })) // 500 = erreur serveur
    })
    .catch(error => res.status(500).json({ error }))
}

exports.login = (req, res, next) => {

}