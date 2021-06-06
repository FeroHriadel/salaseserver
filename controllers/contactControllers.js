const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);



exports.sendForm = (req, res) => {
    try {
        const { email, message } = req.body;
        if (!email || !message) {
            return res.status(400).json({error: `Email and Message are required`});
        }

        const emailData = {
            from: process.env.EMAIL_FROM,
            to: process.env.EMAIL_FROM,
            subject: `Message from Salase`,
            html: `<p>${message}</p>`
        };

        sgMail.send(emailData).then(sent => {
            return res.json({
                message: `Email has been sent to ${email}. Follow the instructions to activate your account.`
            });
        });
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (sendForm)`});
    }


}