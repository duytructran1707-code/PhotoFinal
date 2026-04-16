import React, { Component } from 'react';
import hinh1 from '../assets/imgs/hinh1.jpg';
import hinh2 from '../assets/imgs/hinh2.jpg';
import hinh3 from '../assets/imgs/hinh3.jpg';
import hinh4 from '../assets/imgs/hinh4.jpg';
import hinh5 from '../assets/imgs/hinh5.jpg';
import hinh6 from '../assets/imgs/hinh6.jpg';
import hinh7 from '../assets/imgs/hinh7.jpg';

class Gallery extends Component {
  render() {
    // 7 images with varying heights for Pinterest layout
    const images = [
      { id: 1, src: hinh1, alt: 'Wedding 1' },
      { id: 2, src: hinh2, alt: 'Wedding 2' },
      { id: 3, src: hinh3, alt: 'Wedding 3' },
      { id: 4, src: hinh4, alt: 'Wedding 4' },
      { id: 5, src: hinh5, alt: 'Wedding 5' },
      { id: 6, src: hinh6, alt: 'Wedding 6' },
      { id: 7, src: hinh7, alt: 'Wedding 7' }
    ];

    return (
      <div className="section gallery-section">
        <div className="section-head text-center" style={{ flexDirection: 'column', alignItems: 'center' }}>
          <h2 className="section-title">
            Our <span>Gallery</span>
          </h2>
          <p className="section-sub">
            A glimpse into the magical moments we've captured.
          </p>
        </div>

        <div className="masonry-grid">
          {images.map((img) => (
            <div key={img.id} className="masonry-item">
              <img src={img.src} alt={img.alt} className="masonry-img" />
              <div className="masonry-overlay">
                <span>Hình {img.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default Gallery;
