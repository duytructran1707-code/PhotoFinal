const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const PhotographerDAO = require('./models/PhotographerDAO');
const { Photographer } = require('./models/Models');

const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`;
mongoose.connect(uri)
  .then(async () => {
    console.log('Connected DB');
    // Delete the 2 recently added items:
    await Photographer.deleteMany({ email: 'nguyenvana@shotoflife.com' });
    await Photographer.deleteMany({ email: 'nguyenvanb@shotoflife.com' });
    console.log('Reverted added photographers');
    process.exit(0);
  })
  .catch(e => console.log(e));
