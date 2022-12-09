module.exports = {
  stories: [process.cwd() + "/**/src/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
    "@storybook/preset-scss"
  ],
  framework: "@storybook/react",
  core: {
    builder: "webpack5"
  }
};
