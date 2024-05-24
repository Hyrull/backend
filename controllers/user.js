const bcrypt = require('bcrypt')
const User = require('../models/user')
const jwt = require('jsonwebtoken')



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
  // Chercher l'utilisateur dont l'email est celui envoyé dans la req
  User.findOne({email: req.body.email})
    .then(user => {
      // si y a pas d'user avec ce mail, on dit que ça marche pas
      if (user === null) {
        res.status(401).json({message: 'Combo ID/MDP incorrect'})
      } else {
        // bcrypt a une feature pour comparer les mdp, pas besoin de rehash
        bcrypt.compare(req.body.password, user.password)
          .then(valid => {
            if (!valid) { res.status(401).json({message: 'Combo ID/MDP incorrect'})
             } else {
            // renvoi du token etc pour l'user
            res.status(200).json({
              userId: user._id,
              token: jwt.sign(
                // jwt= json web token (librairie)
                // on encode le token. 1er arg: pour ça on prends bien l'ID en question
                { userId: user._id },
                // 2e argument: clé secrète d'encodage. ici simple, mais en prod faut prendre un string bien compliqué
                'RANDOM_TOKEN_SECRET',
                // 3e argument : expire
                { expiresIn: '24h' }
              )
            })
          }})
          .catch(error => res.status(500).json({ error }))
      }
    })
    .catch(error => res.status(500).json({ error }))
}