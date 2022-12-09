import React from "react";

import { VersionFooter } from ".";
import "bootstrap/dist/css/bootstrap.css";
import "@205093/al-style-guide-2018/scss/index.scss";

export default {
  title: "VersionFooter",
  component: VersionFooter
};

const Template = args => (
  <div id="#root">
    <div class="app">
      <VersionFooter {...args} />
    </div>
  </div>
);

export const BasicVersionFooter = Template.bind({});
BasicVersionFooter.args = {
  version: "1.6.3"
};
