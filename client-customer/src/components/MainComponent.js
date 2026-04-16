import React, { Component } from 'react';
import Menu from './MenuComponent';
import Inform from './InformComponent';
import Home from './HomeComponent';
import { Routes, Route, Navigate } from 'react-router-dom';
import Photographer from './PhotographerComponent';
import PhotographerDetail from './PhotographerDetailComponent';
import Signup from './SignupComponent';
import Active from './ActiveComponent';
import Login from './LoginComponent';
import Myprofile from './MyprofileComponent';
import Mybookings from './MybookingsComponent';
import Myorders from './MyordersComponent';
import Gallery from './GalleryComponent';
class Main extends Component {
  render() {
    return (
      <div className="body-customer">
        <Menu />
        <Inform />
        <Routes>
          <Route path="/" element={<Navigate replace to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/photographer/service/:sid" element={<Photographer />} />
          <Route path="/photographer/search/:keyword" element={<Photographer />} />
          <Route path="/photographer/:id" element={<PhotographerDetail />} />
          <Route path='/signup' element={<Signup />} />
          <Route path='/active' element={<Active />} />
          <Route path='/login' element={<Login />} />
          <Route path='/myprofile' element={<Myprofile />} />
          <Route path='/mybookings' element={<Mybookings />} />
          <Route path='/myorders' element={<Myorders />} />
        </Routes>
      </div>
    );
  }
}

export default Main;