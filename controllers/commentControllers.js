const Hut = require('../models/hutModel');
const User = require('../models/userModel');
const Comment = require('../models/commentModel');



//CREATE COMMENT
exports.addComment = async (req, res) => {
    try {
        const { hutid, user, text, image } = req.body;
        if (!hutid || !user || !text) {
            return res.status(400).json({error: `hutid, user & text are required`});
        }

        const checkUser = await User.findOne({_id: user});
        if (!checkUser) {
            return res.status(404).json({error: `userid doesn't match any user in db (addComment error)`});
        }

        const checkHut = await Hut.findOne({_id: hutid});
        if (!checkHut) {
            return res.status(404).json({error: `hutid doesn't match any hut in db (addComment error)`});
        }

        let comment = new Comment({
            hutid,
            user,
            text
        })

        if (image) {
            comment.image = image
        }

        const createdComment = await comment.save();
        if (!createdComment) {
            return res.status(500).json({error: `Comment could not be saved`});
        } 

        res.status(201).json(createdComment);

    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (addComment)`})
    }
}



//GET COMMENTS BY HUT ID + PAGINATION
exports.getComments = async (req, res) => {
    try {
        //check if hutid
        const hutid  = req.params.hutid;
        if (!hutid) {
            return res.status(400).json({error: `No hutid in req.params (getComments)`});
        }

        //pagination
        const perPage = 10;
        const page = parseInt(req.body.page) || 1;
        const commentsTotal = await Comment.countDocuments({hutid});

        //get comments
        const comments = await Comment.find({hutid})
            .populate('user', 'email')
            .limit(perPage)
            .skip((page - 1) * perPage)
            .sort([['createdAt', 'desc']])

        //error response
        if (!comments) {
            return res.status(400).json({error: `No comments found (getComments)`});
        }

        //result response
        res.json({comments, page, numberOfPages: Math.ceil(commentsTotal/perPage)});
        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (getComments)`})
    }
}



//DELETE COMMENT
exports.deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;
        if (!commentId) {
            return res.status(400).json({error: `No commentId in req.params (deleteComment)`});
        }

        const comment = await Comment.findById(commentId);
        if (!comment) {
            return res.status(404).json({error: `Comment not found (deleteComment)`});
        }

        comment.remove((err, data) => {
            if (err) {
                return res.status(500).json({error: `Comment could not be removed`});
            }

            res.json({message: `Comment deleted`});
        })

        
    } catch (err) {
        console.log(err);
        res.status(500).json({error: `Server error (deleteComment)`})
    }
}

