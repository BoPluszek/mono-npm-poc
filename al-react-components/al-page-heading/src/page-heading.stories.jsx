import React from "react";

import { PageHeading } from ".";
import "bootstrap/dist/css/bootstrap.css";

export default {
  title: "PageHeading",
  component: PageHeading
};

const Template = args => (
  <div id="#root">
    <div class="app">
      <PageHeading {...args}>Page title here...</PageHeading>
    </div>
  </div>
);

export const BasicPageHeading = Template.bind({});
BasicPageHeading.args = {};

export const Subtitle = Template.bind({});
Subtitle.args = {
  subtitle: "Sub title here..."
};

export const RightContent = Template.bind({});
RightContent.args = {
  rightContent: <button>publish</button>
};

export const RightContentWithSubtitle = Template.bind({});
RightContentWithSubtitle.args = {
  rightContent: <button>publish</button>,
  subtitle: "Sub title here..."
};

export const RightContentWithCustomClass = Template.bind({});
RightContentWithCustomClass.args = {
  rightContent: <button>publish</button>,
  subtitle: "Sub title here...",
  rightContentClass: "d-flex align-items-end"
};
