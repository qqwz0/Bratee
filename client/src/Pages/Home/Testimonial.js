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
        <h1 className="primary-heading">Rate it!</h1>
        <p className="primary-text">
        Share your thoughts and rate your favorite books! 
        Help others discover great reads by leaving your honest reviews and ratings.
        </p>
      </div>
      <div className="testimonial-section-bottom">
        {/* <img src={ProfilePic} alt="" />
        <p>
          Lorem ipsum dolor sit amet consectetur. Non tincidunt magna non et
          elit. Dolor turpis molestie dui magnis facilisis at fringilla quam.
        </p>
        <div className="testimonials-stars-container">
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
          <AiFillStar />
        </div>
        <h2>John Doe</h2> */}

        <div className="book-review-card">
              <div className="book-details">
                <img src={bookImage} alt="The 48 Laws of Power" className="book-image" />
                <div className="book-info">
                  <h3>The 48 Laws of Power</h3>
                  <p>Robert Greene</p>
                </div>
              </div>

              <div className="review-section">
                <img src={ProfilePic} alt="John Doe" className="user-image" />
                <div className="review-info">
                  <h4>John Doe</h4>
                  <div className="rating">
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  <AiFillStar />
                  </div>
                  <p>
                    This book was absolutely enlightening! It changed the way I think
                    about leadership and influence. I highly recommend it to anyone
                    looking to grow personally and professionally.
                  </p>
                </div>
              </div>
            </div>
      </div>
    </div>
  );
};

export default Testimonial;