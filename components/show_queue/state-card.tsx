import { Card, CardContent, Typography } from '@mui/material';
import React, { PropsWithoutRef, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const StateCard = (props: PropsWithoutRef<{ stateName: string }>): ReactElement => {
  const { t } = useTranslation();

  return (
    <Card>
      <CardContent sx={{ minWidth: 275 }}>
        <Typography>{t(`global.queue.status.${props.stateName}`)}</Typography>
      </CardContent>
    </Card>
  );
};
