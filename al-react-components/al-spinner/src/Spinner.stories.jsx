import React from "react";

import { Spinner } from ".";
import "bootstrap/dist/css/bootstrap.css";

export default {
  title: "Spinner.",
  component: Spinner
};

const SimpleTemplate = args => <Spinner {...args} />;

const InlineTemplate = args => (
  <span>
    tekst før <Spinner {...args} /> tekst efter
  </span>
);

export const Small = SimpleTemplate.bind({});
Small.args = {
  size: "sm"
};

export const SmallInline = InlineTemplate.bind({});
SmallInline.args = {
  size: "sm",
  inline: true
};

export const SmallInlineWithText = InlineTemplate.bind({});
SmallInlineWithText.args = {
  size: "sm",
  inline: true,
  text: "please wait..."
};

export const WithText = SimpleTemplate.bind({});
WithText.args = {
  text: "please wait..."
};

export const Variant = SimpleTemplate.bind({});
Variant.args = {
  variant: "danger"
};
