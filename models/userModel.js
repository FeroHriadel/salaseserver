const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');



const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            default: 'user'
        },
        resetPasswordLink: {
            data: String,
            default: ''
        },
        resetPasswordLink: {
            type: String,
            default: ''
        }
    },
    { timestamps: true }
);



userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    console.log('********************comparing password***********');//
    console.log('********************compare password result:*****', await bcrypt.compare(enteredPassword, this.password));//
    return await bcrypt.compare(enteredPassword, this.password);
}




module.exports = mongoose.model('User', userSchema);