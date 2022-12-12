import React from "react";

import { ErrorMessage } from ".";
import "bootstrap/dist/css/bootstrap.css";

export default {
  title: "ErrorMessage",
  component: ErrorMessage
};

const Template = args => <ErrorMessage {...args} />;

export const Basic = Template.bind({});
Basic.args = {
  error: new Error("Unable to connect")
};
