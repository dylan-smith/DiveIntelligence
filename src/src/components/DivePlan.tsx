'use client';

import { Box, List, ListItem, ListItemText, Fab, Tooltip, Paper, Typography } from '@mui/material';
import Icon from '@mui/material/Icon';
import AddIcon from '@mui/icons-material/Add';
import Link from 'next/link';
import { useDivePlanner } from '@/context/DivePlannerContext';
import { colonDuration } from '@/utils/format';

export default function DivePlan() {
  const { divePlanner, updateTrigger } = useDivePlanner();
  const segments = divePlanner.getDiveSegments();

  return (
    <Paper elevation={2} sx={{ p: 2, minWidth: 350 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Dive Plan
      </Typography>
      <List dense>
        {segments.map((segment, index) => (
          <ListItem key={index}>
            <Icon sx={{ mr: 1 }}>{segment.Icon}</Icon>
            <ListItemText
              primary={
                <span>
                  {colonDuration(segment.StartTimestamp)} {segment.Title}
                </span>
              }
              secondary={
                <span dangerouslySetInnerHTML={{ __html: segment.Description }} />
              }
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
        <Tooltip title="Change Depth">
          <Fab
            component={Link}
            href="/change-depth"
            color="primary"
            size="small"
          >
            <AddIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="Change Gas">
          <Fab
            component={Link}
            href="/change-gas"
            color="secondary"
            size="small"
          >
            <Icon>air</Icon>
          </Fab>
        </Tooltip>
        <Tooltip title="Stay at Depth">
          <Fab
            component={Link}
            href="/maintain-depth"
            color="default"
            size="small"
          >
            <Icon>arrow_forward</Icon>
          </Fab>
        </Tooltip>
      </Box>
    </Paper>
  );
}
