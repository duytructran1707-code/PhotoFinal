const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const { Service, Photographer } = require('./models/Models');

const uri = 'mongodb+srv://' + MyConstants.DB_USER + ':' + MyConstants.DB_PASS + '@' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE + '?retryWrites=true&w=majority';

async function check() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    const services = await Service.find().sort({ _id: -1 }).limit(5);
    console.log('\n--- LATEST 5 SERVICES ---');
    services.forEach(s => console.log(`ID: ${s._id}, name: "${s.name}", service_name: "${s.service_name}"`));
    
    const photographers = await Photographer.find().sort({ _id: -1 }).limit(5);
    console.log('\n--- LATEST 5 PHOTOGRAPHERS ---');
    photographers.forEach(p => console.log(`ID: ${p._id}, name: "${p.name}", service: ${p.service ? p.service.name : 'NULL'}`));
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

check();
