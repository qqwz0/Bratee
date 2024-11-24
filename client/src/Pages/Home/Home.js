import React from "react";
import BannerBackground from "../../Assets/home-banner-background.png";
import BannerImage from "../../Assets/home-banner-image.png";
import Navbar from "../../Components/Navbar/Navbar";
import { FiArrowRight } from "react-icons/fi";

const Home = () => {
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-banner-container">
        <div className="home-bannerImage-container">
          <img src={BannerBackground} alt="" />
        </div>
        <div className="home-text-section">
          <h1 className="primary-heading">
            Відкривайте нове та діліться враженнями
          </h1>
          <p className="primary-text">
            Знайдіть книги, які відповідають вашим інтересам, залишайте відгуки після кожного читання
            та отримуйте персоналізовані рекомендації від інших читачів!
          </p>
          <button className="secondary-button">
            Спробуйте зараз! <FiArrowRight />{" "}
          </button>
        </div>
        <div className="home-image-section">
          <img src={BannerImage} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Home;
