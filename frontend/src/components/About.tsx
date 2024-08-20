import React from "react";
import "../css/About.css"; // Ensure this path is correct

type Props = {};

const About = (props: Props) => {
  return (
    <div className="about-container">
      <h3>About Us</h3>
      <p>
        Welcome to our restaurant application! Our mission is to provide a
        seamless platform for food enthusiasts and restaurant managers. Whether
        you're looking to explore the best dining options, manage a restaurant,
        or simply enjoy delicious dishes, we've got you covered.
        <br />
        <br />
        Our platform allows users to register, explore restaurants, order food,
        and apply for managerial roles. For restaurant managers, we offer tools
        to create and manage restaurants and track staff and orders. Join us in
        making the dining experience better for everyone!
      </p>
    </div>
  );
};

export default About;
