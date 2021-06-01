const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const bcrypt = require('bcryptjs');



//PRE-SIGNUP
exports.preSignup = async (req, res) => {
    try {
        //grab email & password from request
        const { email, password } = req.body;

        //check if user is new
        const user = await User.findOne({email: email.toLowerCase()});
        if (user) {
            return res.staus(401).json({error: `Email is already taken`});
        }

        //make a token with user email & password
        const token = jwt.sign({email, password}, process.env.JWT_ACCOUNT_ACTIVATION, {expiresIn: '10min'});

        //send email
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: `Account Activation Link`,
            html: `
            <p>Please use the following link to activate your acccount:</p>
            <p>${process.env.CLIENT_URL}/activate/${token}</p>
            <hr />
            <p>This email may contain sensetive information</p>
            <p>https://salase.info</p>
        `
        };

        sgMail.send(emailData).then(sent => {
            return res.json({
                message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
            });
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (preSignup)`});
    }
}



/*
//SIGNUP WITHOUT EMAIL
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
*/



//SIGNUP WITH EMAIL
exports.signup = (req, res) => {
    try {
        //grab token from req
        const token = req.body.token;
        if (!token) {
            return res.status(400).json({error: `No token sent`});
        }

        //verify if token didn't expire & matches
        let verified = false;
        jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATION, function(err, decoded) {
            if (err) {
                return res.status(401).json({error: `Bad or expired link`});
            }

            verified = true;
        });

        //decode email & password from token and save user in db
        if (verified) {

            //decode email & password from token
            const { email, password } = jwt.decode(token);

            //save user
            let newUser = new User({email, password});
            const user = newUser.save((err, user) => {
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
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (Signup)`});
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



            /////////////////BUG FIX => check if matchPassword returns true //////////////////////////////////////////////
            //for some uncanny reason the '//match password' validation below this bugfix failed with incorrect password
            //and it threw all client off. This seemed to be the best way to fix it.
                        if (await user.matchPassword((password)) !== true) {
                            return res.status(401).json({error: `Password doesn't match`});
                        }
            /////////////////////////////////////////////////////////////////////////////////////////////////////////////



            //match password
            if (user && await user.matchPassword(password) === true) {
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



//FORGOT PASSWORD
exports.forgotPassword = async (req, res) => {
    //check body for email
    const { email } = req.body;
    if (!email || !email.includes('@') || !email.includes('.')) {
        res.status(400).json({error: `A valid email address is required`});
    }

    //find user by email
    const user = await User.findOne({email});
    if (!user) {
        res.status(404).json({error: `User not found (resetPassword)`});
    }

    //put user._id in a token that is only valid for 10 minutes
    const token = jwt.sign({ _id: user._id }, process.env.JWT_RESET_PASSWORD, { expiresIn: '10m' });

    // prepare email
    const emailData = {
        from: process.env.EMAIL_FROM,
        to: email,
        subject: `Password reset link`,
        html: `
        <p>Please use the following link to reset your password:</p>
        <p>${process.env.CLIENT_URL}/passwordreset/${token}</p>
        <hr />
        <p>This email may contain sensetive information</p>
        <p>https://salase.info</p>
    `
    };

    //update resetPasswordLink in db
    return user.updateOne({ resetPasswordLink: token }, (err, success) => {
        if (err) {
            return res.json({error: `User's resetPasswordLink could not be updated (forgotPassword)`});
        } else {
            //send email
            sgMail.send(emailData).then(sent => {
                //respond with message
                return res.json({message: `Email has been sent to ${email}. Follow the instructions to reset your password. Link expires in 10min.`});
            });
        }
    });
}


 
//RESET PASSWORD
exports.resetPassword = async (req, res) => {
    try {
        //check if resetPasswordLink & newPassword
        const { resetPasswordLink, newPassword } = req.body; //resetPasswordLink = token from forgotPassword above = encoded {_id: user._id}
        if (!resetPasswordLink || !newPassword) {
            return res.status(400).json({error: `resetPasswordLink & newPassword are required`});
        }

        //verify if resetPasswordLink didn't expire & matches
        let verified = false;
        jwt.verify(resetPasswordLink, process.env.JWT_RESET_PASSWORD, function(err, decoded) {
            if (err) {
                return res.status(401).json({error: `Bad or expired link`});
            }

            verified = true;
        });

        //encrypt and set new password and delete resetPasswordLink:
        if (verified) {
            const salt = await bcrypt.genSalt(10);
            const hashedNewPassword = await bcrypt.hash(newPassword, salt);
            const user = await User.findOneAndUpdate({resetPasswordLink}, {password: hashedNewPassword, resetPasswordLink: ''}, {new: true});
            res.json({message: `New password saved`});
        }

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (resetPassword)`});
    }
}



