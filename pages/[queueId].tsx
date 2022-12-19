import React, { Fragment, ReactElement, useState } from "react";
import { Tab, Tabs, Typography } from "@mui/material";
import { JobCounts } from "bull";
import { Request } from "express";
import { useTranslation } from "react-i18next";

import { StateCard } from "../components/show_queue";
import { queuesService, SerializableQueue } from "../services/queues";
import { STATES } from "../services/jobs";

interface Props {
  queue: SerializableQueue | null;
  counts: JobCounts | null;
}

export async function getServerSideProps(
  context: Request
): Promise<{ props: Props }> {
  const { queueId } = context.params;

  return {
    props: {
      queue: await queuesService.getQueueFromKey(queueId),
      counts: await queuesService.getQueueCounts(queueId),
    },
  };
}

export default function Queue(props: Props): ReactElement {
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState(STATES.WAITING);
  const handleTabChange = (_event: React.SyntheticEvent, newValue: STATES) => {
    setTabValue(newValue);
  };

  if (!props.queue) {
    return <Typography variant="h3">{t("show_queue.not_found")}</Typography>;
  }
  const queue = props.queue;

  return (
    <Fragment>
      <Typography variant="h3">{props.queue.name}</Typography>
      <Tabs value={tabValue} onChange={handleTabChange}>
        {Object.values(STATES).map((s) => {
          const count =
            typeof props.counts?.[s] === "number" ? props.counts[s] : "N/A";
          const label = `${s} (${count})`;
          return <Tab label={label} value={s} key={s} />;
        })}
      </Tabs>
      {Object.values(STATES).map((s) => (
        <Fragment key={s}>
          {tabValue === s && <StateCard stateName={s} />}
        </Fragment>
      ))}
    </Fragment>
  );
}
