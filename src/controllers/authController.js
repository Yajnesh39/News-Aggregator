 var jwt = require('jsonwebtoken');
 var bcryptjs = require('bcryptjs');
 var User = require('../models/user');

 
 //Controller defined for register
 var signup = (req,res) => { 
    const user = new User({
        fullName: req.body.fullName,
        role: req.body.role,
        email: req.body.email,
        password: bcryptjs.hashSync(req.body.password, 8),
        newsPreferences: req.body.newsPreferences
      });
    user.save().then(data => { 
        return res.status(200).send('User Registered successfully'); 
    }).catch(err => {
        return res.status(500).send('User registration failed : '+err);
    });
 }


 //Controller defined for signin
 var signin = (req,res) => { 

    User.findOne({ email : req.body.email }).then((user) => {
        var passwordIsValid = bcryptjs.compareSync(req.body.password , user.password);
        //check for invalid password in db
        if(!passwordIsValid) { 
            return res.status(401).send({ 
                accessToken: null,
                message: "Invalid Password!" 
            }); 
        }
        //If password is valid, generate token
        var token = jwt.sign({
            id : user.id
        },process.env.API_SECRET, {
            expiresIn : 864000
        });
        //response to client request with user profile, message & access token
        return res.status(200).send({
            user: {
                user: user._id,
                email: user.email,
                fullName: user.fullName,
                newsPreferences: user.newsPreferences
            },
            message: 'Login Successfull',
            accessToken: token
        });
    }).catch(err => { 
        if (err) { 
            return res.status(500).send({
                message: err
            })
        }
    });

 };

 module.exports = {signup,signin};