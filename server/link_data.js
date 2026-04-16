const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const { Service, Photographer } = require('./models/Models');

const uri = 'mongodb+srv://' + MyConstants.DB_USER + ':' + MyConstants.DB_PASS + '@' + MyConstants.DB_SERVER + '/' + MyConstants.DB_DATABASE + '?retryWrites=true&w=majority';

async function link() {
  try {
    await mongoose.connect(uri);
    console.log('Connected to DB');
    
    const s1 = await Service.findOne({ service_name: /Phim Quảng Cáo/ });
    const s2 = await Service.findOne({ service_name: /Quay Phim/ });
    
    if (s1 && s2) {
      await Photographer.findOneAndUpdate({ name: "Nguyễn Văn A" }, { service: s1 });
      await Photographer.findOneAndUpdate({ name: "Nguyễn Thị B" }, { service: s2 });
      console.log('Linked photographers to services');
    } else {
      console.log('Could not find services to link');
    }
    
    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
}

link();
