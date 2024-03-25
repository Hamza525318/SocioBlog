const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const options = {
    use_filename: true,
    unique_filename: false,
    overwrite: true,
};

cloudinary.config({
    api_key: '491635661581794',
    cloud_name: 'dduzbqxt7',
    api_secret: 'vKetyuzsgzIwrAoWMsztE-Ah6DA',
})


const uploadImage = (image) => {
    //imgage = > base64
    return new Promise(async(resolve, reject) => {
      await cloudinary.uploader.upload(image,options,(error, result) => {
        if (result && result.secure_url) {
          console.log(result.secure_url);
          fs.unlinkSync(image)
          return resolve(result.secure_url);
        }
        console.log(error.message);
        fs.unlinkSync(image);
        return reject({ message: error.message });
      });
    });
  };

// const uploadImage = async(image) => {
//     //imgage = > base64
//     console.log(cloudinary.config());
//     const result = await cloudinary.uploader.upload(image,options).catch((err)=>console.log(err));
//     return result.secure_url;
   
// };


module.exports = uploadImage;