import React from "react";
import ProfilePic from "../../Assets/john-doe-image.png";
import AboutBackground from "../../Assets/about-background.png";
import { AiFillStar } from "react-icons/ai";
import bookImage from "../../Assets/laws_image.jpg";

const Testimonial = () => {
  return (
    <div className="work-section-wrapper">
      <div className="about-background-image-container">
        <img src={AboutBackground} alt="" />
      </div>
      <div className="work-section-top">
        <h1 className="primary-heading">Оцінюйте!</h1>
        <p className="primary-text">
          Поділіться своїми думками та оцініть ваші улюблені книги! Допоможіть іншим
          знайти чудові книги, залишаючи чесні відгуки та оцінки.
        </p>
      </div>
      <div className="testimonial-section-bottom">
      
        <div className="book-review-card">
              <div className="book-details">
                <img src={bookImage} alt="The 48 Laws of Power" className="book-image" />
                <div className="book-info">
                  <h3>48 законів влади</h3>
                  <p>Роберт Грін</p>
                </div>
              </div>

              <div className="review-section">
                <img src={ProfilePic} alt="John Doe" className="user-image" />
                <div className="review-info">
                  <h4>Джон Доу</h4>
                  <div className="rating">
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  </div>
                  <p>
                    Ця книга була абсолютно просвітлюючою! Вона змінила моє
                    ставлення до лідерства та впливу. Я настійно рекомендую її
                    кожному, хто хоче розвиватися особисто та професійно.
                  </p>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
};

export default Testimonial;
