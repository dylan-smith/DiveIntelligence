'use client';

import { Container, Typography } from '@mui/material';

export default function NewDivePage() {
  return (
    <Container component="main">
      <Typography variant="h3" gutterBottom>
        New Dive - Coming Soon
      </Typography>
      <Typography variant="body1">
        This page will allow you to select starting gas and configure dive settings.
      </Typography>
    </Container>
  );
}
