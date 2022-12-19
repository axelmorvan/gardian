import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import React, { PropsWithoutRef, ReactElement } from 'react';
import { useTranslation } from 'react-i18next';

export const GardianAppBar = (_props: PropsWithoutRef<Record<string, never>>): ReactElement => {
  const { t } = useTranslation();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar style={{ height: '64px' }}>
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}></IconButton>
          <Typography style={{ textTransform: 'capitalize' }} variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {t('global.app_name')}
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
};
