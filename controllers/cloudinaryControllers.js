const cloudinary = require("cloudinary"); //import cloudinary

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



//UPLOAD IMAGES
exports.uploadImages = async (req, res) => {
    try {
        //console.log(req.body.image); // => should print a lot of symbols (img data)
        let result = await cloudinary.uploader.upload(req.body.image, {
            public_id: `${Date.now()}`,//set public id => we set it to current time
            resource_type: "auto", // jpeg, png
          });

          res.json({
            public_id: result.public_id,
            url: result.secure_url,
          });

    } catch (err) {
        console.log(err)
        res.status(500).json(`Server Error (images upload)`)
    }
};



//DELETE IMAGE
exports.removeImage = (req, res) => {
  try {
    let public_id = req.params.public_id; //each image has public_id which was created when we uploaded the image
    if (!public_id) {
      return res.status(400).json({error: `No public_id in req.body`})
    }
  
    cloudinary.uploader.destroy(public_id, (err, result) => {
      //Reports error but deletes the image anyway. Screw him.
      // if (err) {
      //   console.log(err);
      //   return res.status(400).json({ error: `Error. Image NOT deleted` });
      // }
      
      res.json({message: `Image deleted`});
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({error: `Server error`});
  }
};
