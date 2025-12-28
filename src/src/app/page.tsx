'use client';

import { Button, Box, Container } from '@mui/material';
import Link from 'next/link';
import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    // Load YouTube API
    if (typeof window !== 'undefined' && !(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
    }
  }, []);

  return (
    <Container component="main">
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        gap: 4, 
        paddingTop: 8 
      }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <Link href="/new-dive" passHref legacyBehavior>
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{ fontSize: '1.2rem', padding: '12px 48px' }}
            >
              Plan a Dive
            </Button>
          </Link>
        </Box>
        
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          gap: 2,
          marginTop: 4 
        }}>
          <Box sx={{ maxWidth: '640px', aspectRatio: '16/9' }}>
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/embed/Oh7F81326cU"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </Box>
          
          <Link href="https://github.com/dylan-smith/DiveIntelligence/issues" target="_blank" rel="noopener">
            <Button
              variant="outlined"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                padding: '12px 24px',
                justifyContent: 'space-between',
                minWidth: '300px'
              }}
            >
              <span>Bug Reports + Feature Requests</span>
              <img src="/assets/github-mark.svg" alt="github logo" style={{ width: 24, height: 24 }} />
            </Button>
          </Link>
          
          <Link href="https://github.com/dylan-smith/DiveIntelligence/discussions" target="_blank" rel="noopener">
            <Button
              variant="outlined"
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 2, 
                padding: '12px 24px',
                justifyContent: 'space-between',
                minWidth: '300px'
              }}
            >
              <span>Q&A + Discussion</span>
              <img src="/assets/github-mark.svg" alt="github logo" style={{ width: 24, height: 24 }} />
            </Button>
          </Link>
        </Box>
      </Box>
    </Container>
  );
}
