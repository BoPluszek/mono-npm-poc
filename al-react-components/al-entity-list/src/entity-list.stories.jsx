import React from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { EntityList } from ".";
import "bootstrap/dist/css/bootstrap.css";

export default {
  title: "EntityList",
  component: EntityList
};

const Template = args => (
  <Router>
    <EntityList {...args} />
  </Router>
);

const kids = [
  {
    id: 1,
    name: "Buster",
    age: 6
  },
  {
    id: 2,
    name: "Thilde",
    age: 1
  },
  {
    id: 3,
    name: "Kia",
    age: 35
  },
  {
    id: 4,
    name: "Bo",
    age: 39
  }
];

export const Basic = Template.bind({});
Basic.args = {
  items: kids
};

export const ColumnsDefined = Template.bind({});
ColumnsDefined.args = {
  items: kids,
  columns: [
    {
      text: "Navn",
      content: item => item.name
    },
    {
      text: "Alder",
      content: item => `${item.age} år`,
      cellStyle: { fontWeight: "bold" }
    }
  ]
};

export const RowStyles = Template.bind({});
RowStyles.args = {
  items: kids,
  rowStyle: item => (item.age < 10 ? { backgroundColor: "red" } : { color: "green" })
};

export const RowOnclick = Template.bind({});
RowOnclick.args = {
  items: kids,
  rowProps: item => ({
    onClick: () => {
      alert(`Nice! you clicked\r\n${item.name}`);
    }
  })
};

export const NoItemsDefault = Template.bind({});
NoItemsDefault.args = {
  items: []
};

export const NoItemsChildNodes = Template.bind({});
NoItemsChildNodes.args = {
  items: [],
  noItemsText: (
    <span>
      <h1>NO!</h1> items found
    </span>
  )
};
