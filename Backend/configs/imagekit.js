const ImageKit = require('@imagekit/nodejs')
const dotenv = require('dotenv')

dotenv.config(); 

const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY
});

module.exports = imagekit