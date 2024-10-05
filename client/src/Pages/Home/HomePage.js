import React from "react";
import BooksSlider from "./BooksSlider";
import Contact from "./Contact";
import Homee from "./Home";
import Testimonial from "./Testimonial";
import "./Home.css";


const Home = () => {
  return (
  <div style={{backgroundImage: 'url("images/back.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>

    <Homee />
    <BooksSlider />
    <Testimonial />
    <Contact />

    </div>
  );
};

export default Home;