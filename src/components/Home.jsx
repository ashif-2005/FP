import React from "react";
import logo from '../assets/logo.png'

const Home = () => {
  return (
    <div className="page-container">
      <div className="content-wrapper">
        <div className="wrp">
        <div className="home-logo">
          <img src={logo} alt="Friends Packs Logo" />
        </div>
        <p className="home-tagline">Leading the way in high-quality polybag manufacturing.</p>
        
        <div className="home-description">
          <p>
            Friends Packs is a trusted name in polybag manufacturing, providing durable and eco-friendly packaging solutions. 
            We specialize in high-quality plastic packaging for various industries, ensuring strength, reliability, and sustainability.
          </p>
          <p>
            Our advanced manufacturing process guarantees top-notch products that cater to your business needs, whether it's for retail, 
            industrial, or custom packaging solutions.
          </p>
        </div>
        </div>
        
        <div className="home-features">
          <div className="feature">
            <h3> Eco-Friendly Materials</h3>
            <p>We prioritize sustainability with biodegradable and recyclable packaging solutions.</p>
          </div>
          <div className="feature">
            <h3> High-Quality Manufacturing</h3>
            <p>Using state-of-the-art technology to produce durable and reliable polybags.</p>
          </div>
          <div className="feature">
            <h3> Custom Packaging</h3>
            <p>Tailor-made polybag solutions to meet your unique business requirements.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
