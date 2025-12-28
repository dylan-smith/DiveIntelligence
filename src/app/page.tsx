'use client';

import { useEffect, useState } from 'react';
import { Button, Box } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const [apiLoaded, setApiLoaded] = useState(false);

  useEffect(() => {
    if (!apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      setApiLoaded(true);
    }
  }, [apiLoaded]);

  return (
    <Box
      component="main"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '40px 20px',
        minHeight: '100vh',
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Button
          variant="contained"
          color="primary"
          component={Link}
          href="/new-dive"
          id="plan-dive"
          size="large"
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
        <Box sx={{ mb: 2 }}>
          <iframe
            width="560"
            height="315"
            src="https://www.youtube.com/embed/Oh7F81326cU"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </Box>
        <Button
          variant="outlined"
          href="https://github.com/dylan-smith/DiveIntelligence/issues"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <span>Bug Reports + Feature Requests</span>
          <Image
            src="/assets/github-mark.svg"
            alt="github logo"
            width={24}
            height={24}
          />
        </Button>
        <Button
          variant="outlined"
          href="https://github.com/dylan-smith/DiveIntelligence/discussions"
          target="_blank"
          rel="noopener noreferrer"
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <span>Q&A + Discussion</span>
          <Image
            src="/assets/github-mark.svg"
            alt="github logo"
            width={24}
            height={24}
          />
        </Button>
      </Box>
    </Box>
  );
}
