const jwt = require("jsonwebtoken");
var User = require('../models/user');

//middleware to verify token
const verifyToken = (req, res, next) => { 
    console.log("In Verifytoken");
    if (req.headers && req.headers.authorization) { 
        jwt.verify(req.headers.authorization, process.env.API_SECRET, function (err, decodedValue) { 
            if (err) { 
                req.user = undefined;
                next();
            }
            User.findOne({_id: decodedValue.id}).then(user => {
                req.user = user;
                next();
            }).catch(err => {
                res.status(500).send({ message: err }); 
            });
        });
    } else { 
        req.user = undefined;
        req.message = "Authorization header not found";
        next();
    }
};

module.exports = verifyToken;