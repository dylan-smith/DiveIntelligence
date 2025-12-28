'use client';

import React from 'react';
import Link from 'next/link';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Fab,
  Tooltip,
  Paper,
} from '@mui/material';
import Icon from '@mui/material/Icon';
import HeightIcon from '@mui/icons-material/Height';
import AirIcon from '@mui/icons-material/Air';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useDivePlanner } from '../contexts/DivePlannerContext';
import { colonDuration } from '../utility/formatters';

export default function DivePlan() {
  const { divePlanner, updateTrigger } = useDivePlanner();
  const planEvents = divePlanner.getDiveSegments();

  return (
    <Box sx={{ mb: 2 }}>
      <Paper elevation={2}>
        <List>
          {planEvents.map((event, index) => (
            <ListItem key={index}>
              <ListItemIcon>
                <Icon>{event.Icon}</Icon>
              </ListItemIcon>
              <ListItemText
                primary={`${colonDuration(event.StartTimestamp)} ${event.Title}`}
                secondary={<span dangerouslySetInnerHTML={{ __html: event.Description }} />}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
      <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
        <Tooltip title="Ascend/Descend">
          <Fab color="primary" component={Link} href="/change-depth">
            <HeightIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Change Gas">
          <Fab color="primary" component={Link} href="/change-gas">
            <AirIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Maintain Depth">
          <Fab color="primary" component={Link} href="/maintain-depth">
            <ArrowForwardIcon />
          </Fab>
        </Tooltip>
      </Box>
    </Box>
  );
}
