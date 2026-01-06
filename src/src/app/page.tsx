'use client';

import { Box, Button, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import YouTube from 'react-youtube';

export default function HomePage() {
  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        p: 2,
        gap: 4,
      }}
    >
      <Box sx={{ mt: 4 }}>
        <Button
          component={Link}
          href="/new-dive"
          variant="contained"
          color="primary"
          size="large"
          id="plan-dive"
        >
          Plan a Dive
        </Button>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 2,
        }}
      >
        <YouTube videoId="Oh7F81326cU" />
        <MuiLink
          href="https://github.com/dylan-smith/DiveIntelligence/issues"
          sx={{ textDecoration: 'none' }}
        >
          <Button variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>Bug Reports + Feature Requests</span>
            <Box
              component="img"
              src="/github-mark.svg"
              alt="github logo"
              sx={{ width: 24, height: 24 }}
            />
          </Button>
        </MuiLink>
        <MuiLink
          href="https://github.com/dylan-smith/DiveIntelligence/discussions"
          sx={{ textDecoration: 'none' }}
        >
          <Button variant="outlined" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <span>Q&amp;A + Discussion</span>
            <Box
              component="img"
              src="/github-mark.svg"
              alt="github logo"
              sx={{ width: 24, height: 24 }}
            />
          </Button>
        </MuiLink>
      </Box>
    </Box>
  );
}
