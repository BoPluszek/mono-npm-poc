import React from "react";

import { EntityHistoryModal } from ".";
import "bootstrap/dist/css/bootstrap.css";

export default {
  title: "EntityHistoryModal",
  component: EntityHistoryModal
};

const log = [
  {
    id: 1,
    text: "Started",
    timestamp: new Date()
  },
  {
    id: 2,
    text: "executing task 1",
    timestamp: new Date()
  },
  {
    id: 3,
    text: "executing task 2",
    timestamp: new Date()
  },
  {
    id: 4,
    text: "Ended",
    timestamp: new Date()
  }
];

const Template = args => <EntityHistoryModal {...args} />;

export const BasicEntityHistoryModal = Template.bind({});
BasicEntityHistoryModal.args = {
  title: "Log",
  items: log
};
