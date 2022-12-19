import { ResourceLanguage } from "i18next";

import { STATES } from "../services/jobs";

const translation: ResourceLanguage = {
  global: {
    app_name: "gardian",
    queue: {
      status: {
        [STATES.WAITING]: "waiting",
        [STATES.DELAYED]: "delayed",
        [STATES.ACTIVE]: "active",
        [STATES.COMPLETED]: "completed",
        [STATES.FAILED]: "failed",
      },
    },
  },
  list_queues: {
    title: "summary",
    name: "queue name",
  },
  show_queue: {
    not_found: "queue not found",
  },
};

export default translation;
