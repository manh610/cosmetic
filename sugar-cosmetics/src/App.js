import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import ControlledCarousel from './components/HomePage/Carousal';
import { Carousel } from 'react-bootstrap';
import { useState } from 'react';
import Navbar from './components/Navbar';
import AllRoutes from './Pages/AllRoutes';
import { ToastContainer } from 'react-toastify';


function App() {


  return (
    <div className="App">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <AllRoutes />
    </div>
  );
}

export default App;
