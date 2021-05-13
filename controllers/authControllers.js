const User = require('../models/userModel');
const jwt = require('jsonwebtoken'); 



//SIGNUP
  //creates user in db
  //creates a token with user._id (jwt.sign({_id: user._id}))
  //sets cookie => token: token
  //responds with {token, user}
exports.signup = (req, res) => {
    try {
        //check req.body
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({error: `Email and Password are required`})
        }

        //check if user is new
        User.findOne({email}).exec((err, user) => {
            if (err) {
                return res.status(500).json({error: `Server Error (signup/find user)`})
            }

            if (user) {
                return res.status(400).json({error: `Email already exists`})
            }
        })

        //save user
        let newUser = new User({email, password});
        newUser.save((err, user) => {
            if (err) {
                return res.status(500).json({error: `User could not be saved`});
            }

            //generate token with {_id: user._id} in it:
            const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

            //set cookie
            res.cookie('token', token);

            //respond with token and user
            const { _id, email, role } = user;
            res.status(201).json({
                token,
                user: {_id, email, role}
            })
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server Error (signup)`})
    }
}





//SIGNIN
  //finds user in db and compares if password matches
  //creates a token with user._id (jwt.sign({_id: user._id}))
  //sets cookie => token: token
  //responds with {token, user}
exports.signin = async (req, res) => {
    try {
        //check req.body
        const {email, password} = req.body;
        if (!email || !password) {
            return res.status(400).json({error: `Email and Password are required`});
        }

        //find user in DB
        const user = await User.findOne({email});
        if (!user) {
            return res.status(404).json({error: `Not found (signin/User.findOne)`})
        }

            //match password
            if (user && await user.matchPassword(password)) {
                //generate token with {_id: user._id} in it:
                const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);

                //set cookie
                res.cookie('token', token);

                //respond with token and user
                const { _id, email, role } = user;
                res.status(200).json({
                    token,
                    user: {_id, email, role}
                })
                
            } else {
                return res.status(401).json(`Email and password don't match`)
            }
                
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server Error (signin.catch)`})
    }
}




//SIGN OUT
exports.signout = (req, res) => {
    res.clearCookie('token'); //clear cookie
    res.json({
        message: 'Signout success'
    });
};
