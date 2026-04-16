const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const { Service } = require('./models/Models');

const uri = 'mongodb+srv://' + MyConstants.DB_USER + ':' + MyConstants.DB_PASS + '@' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE + '?retryWrites=true&w=majority';

async function cleanup() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    // Fix services with "undefined" name or missing name
    const services = await Service.find();
    console.log(`Found ${services.length} services`);
    
    for (const s of services) {
      const actualName = (s.service_name && s.service_name !== 'undefined') ? s.service_name : ((s.name && s.name !== 'undefined') ? s.name : 'Unknown Service');
      
      console.log(`Updating ${s._id}: ${actualName}`);
      await Service.findByIdAndUpdate(s._id, {
        name: actualName,
        service_name: actualName
      });
    }
    
    console.log('Cleanup complete');
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

cleanup();
