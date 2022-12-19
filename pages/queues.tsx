import {
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { JobCounts } from "bull";
import React, { Fragment, ReactElement } from "react";
import { useTranslation } from "react-i18next";

import { queuesService, SerializableQueue } from "../services/queues";
import { STATES } from "../services/jobs";

interface Props {
  queues: SerializableQueue[];
  counts: Record<string, JobCounts>;
}

export async function getServerSideProps(): Promise<{ props: Props }> {
  return {
    props: {
      queues: await queuesService.getQueuesList(),
      counts: await queuesService.getAllCounts(),
    },
  };
}

export default function Queues(props: Props): ReactElement {
  const { t } = useTranslation();

  return (
    <Fragment>
      <Typography variant="h3" style={{ textTransform: "capitalize" }}>
        {t("list_queues.title")}
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell style={{ textTransform: "capitalize" }}>
                {t("list_queues.name")}
              </TableCell>
              <TableCell align="right" style={{ textTransform: "capitalize" }}>
                {t(`global.queue.status.${STATES.WAITING}`)}
              </TableCell>
              <TableCell align="right" style={{ textTransform: "capitalize" }}>
                {t(`global.queue.status.${STATES.DELAYED}`)}
              </TableCell>
              <TableCell align="right" style={{ textTransform: "capitalize" }}>
                {t(`global.queue.status.${STATES.ACTIVE}`)}
              </TableCell>
              <TableCell align="right" style={{ textTransform: "capitalize" }}>
                {t(`global.queue.status.${STATES.COMPLETED}`)}
              </TableCell>
              <TableCell align="right" style={{ textTransform: "capitalize" }}>
                {t(`global.queue.status.${STATES.FAILED}`)}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {props.queues.map((queue) => (
              <TableRow key={queue.key}>
                <TableCell component="th" scope="row">
                  {queue.client ? (
                    <CheckCircle color="success"></CheckCircle>
                  ) : (
                    <Cancel color="error"></Cancel>
                  )}
                </TableCell>
                <TableCell component="th" scope="row">
                  <Link href={`/${queue.key}`}>{queue.name}</Link>
                </TableCell>
                <TableCell align="right">
                  {queue.client
                    ? props.counts[queue.key][STATES.WAITING]
                    : "N/A"}
                </TableCell>
                <TableCell align="right">
                  {queue.client
                    ? props.counts[queue.key][STATES.DELAYED]
                    : "N/A"}
                </TableCell>
                <TableCell align="right">
                  {queue.client
                    ? props.counts[queue.key][STATES.ACTIVE]
                    : "N/A"}
                </TableCell>
                <TableCell align="right">
                  {queue.client
                    ? props.counts[queue.key][STATES.COMPLETED]
                    : "N/A"}
                </TableCell>
                <TableCell align="right">
                  {queue.client
                    ? props.counts[queue.key][STATES.FAILED]
                    : "N/A"}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Fragment>
  );
}
