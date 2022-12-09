import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { Navbar } from ".";
import "bootstrap/dist/css/bootstrap.css";

export default {
  title: "Navbar",
  component: Navbar
};

const Template = args => (
  <Router>
    <Navbar {...args} />
  </Router>
);

export const BasicNavBar = Template.bind({});
BasicNavBar.args = {
  brand: { url: "/", text: "Demo" },
  items: [
    {
      url: "#",
      text: "Home"
    },
    {
      url: "#",
      text: "About"
    }
  ]
};
