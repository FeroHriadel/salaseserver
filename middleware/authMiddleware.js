const jwt = require('jsonwebtoken');
const User = require('../models/userModel');



//require matching _id in Header
exports.loggedInOnly = async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]; //token is encrypted _id
            const decoded = jwt.verify(token, process.env.JWT_SECRET); //decrypt _id from header
            req.user = await User.findById(decoded._id).select('-password'); //find user by id and fetch their details. Save these details as req.user. Now the controller gets: req.user = {_id, email, role...}
    
            next()
        } catch (err) {
            console.log(err);
            res.status(401).json({error: `Not authorized, token failed`});
        }
    } else {
        res.status(401).json({error: `Unauthorized (headers/Authorization && starts with 'Bearer')`})
    }
}



//access to admin only
exports.adminOnly = (req, res, next) => {
    try {
        if (req.user && req.user.role === 'admin') {
            next();
        } else {
            res.status(401).json({error: `Unauthorized`})
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server Error (admimOnly middleware)`})
    }
}

