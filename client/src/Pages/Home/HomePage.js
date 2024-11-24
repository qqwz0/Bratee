import React from "react";
import BooksSlider from "./BooksSlider";
import Homee from "./Home";
import Testimonial from "./Testimonial";
import "./Home.css";


const Home = () => {
  return (
  <div style={{backgroundImage: 'url("images/back.jpg")', backgroundSize: 'cover', backgroundRepeat: 'no-repeat'}}>

    <Homee />
    <BooksSlider />
    <Testimonial />
    </div>
  );
};

export default Home;