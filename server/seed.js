const mongoose = require('mongoose');
const MyConstants = require('./utils/MyConstants');
const PhotographerDAO = require('./models/PhotographerDAO');
const ServiceDAO = require('./models/ServiceDAO');

const uri = `mongodb+srv://${MyConstants.DB_USER}:${MyConstants.DB_PASS}@${MyConstants.DB_SERVER}/${MyConstants.DB_DATABASE}`;

mongoose.connect(uri)
  .then(async () => {
    console.log('Connected to DB');
    const services = await ServiceDAO.selectAll();
    
    let svc1 = services.find(s => s.name?.toLowerCase().includes('cưới') || s.service_name?.toLowerCase().includes('cưới'));
    let svc2 = services.find(s => s.name?.toLowerCase().includes('sự kiện') || s.service_name?.toLowerCase().includes('sự kiện'));

    if (!svc1 && services.length > 0) svc1 = services[0];
    if (!svc2 && services.length > 1) svc2 = services[1];
    if (!svc2 && services.length > 0) svc2 = services[0];

    if (!svc1) svc1 = { _id: new mongoose.Types.ObjectId(), name: 'Chụp ảnh cưới' };
    if (!svc2) svc2 = { _id: new mongoose.Types.ObjectId(), name: 'Quay phim sự kiện' };

    await PhotographerDAO.insert({
      name: 'Nguyễn Văn A',
      role: 'Wedding Photographer',
      bio: 'Lưu giữ những khoảnh khắc lãng mạn nhất trong ngày cưới của bạn.',
      phone: '0901234567',
      email: 'nguyenvana@shotoflife.com',
      location: 'Hồ Chí Minh',
      pricePerHour: 1000000,
      rating: 4.9,
      cdate: new Date().getTime(),
      service: svc1,
      avatar: '' 
    });

    await PhotographerDAO.insert({
      name: 'Nguyễn Văn B',
      role: 'Event Photographer',
      bio: 'Chuyên gia chụp ảnh sự kiện chuyên nghiệp, chất lượng 4K.',
      phone: '0907654321',
      email: 'nguyenvanb@shotoflife.com',
      location: 'Hà Nội',
      pricePerHour: 800000,
      rating: 4.8,
      cdate: new Date().getTime(),
      service: svc2,
      avatar: '' 
    });
    
    console.log('Seeded 2 photographers');
    process.exit(0);
  })
  .catch(err => {
    console.log(err);
    process.exit(1);
  });
