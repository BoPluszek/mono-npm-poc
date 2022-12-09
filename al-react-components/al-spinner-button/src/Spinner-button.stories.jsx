import React from "react";

import { SpinnerButton } from ".";
import "bootstrap/dist/css/bootstrap.css";

export default {
  title: "SpinnerButton",
  component: SpinnerButton
};

const Template = args => <SpinnerButton {...args}>Click me...</SpinnerButton>;

export const LoadingState = Template.bind({});
LoadingState.args = {
  isLoading: true
};

export const IdleState = Template.bind({});
IdleState.args = {
  isLoading: false
};
