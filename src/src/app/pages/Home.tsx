import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { trackEvent } from '../application-insights';
import './Home.css';

export function Home() {
  const navigate = useNavigate();
  const resolutionTracked = useRef(false);

  useEffect(() => {
    if (resolutionTracked.current) return;
    resolutionTracked.current = true;

    trackEvent('ResolutionInfo', {
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      devicePixelRatio: window.devicePixelRatio,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      orientation: window.screen.orientation,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    });
  }, []);

  return (
    <main className="home-main">
      <div className="top-section">
        <Button id="plan-dive" variant="contained" color="primary" onClick={() => navigate('/new-dive')}>
          Plan a Dive
        </Button>
      </div>
      <div className="help">
        <iframe
          width="640"
          height="360"
          src="https://www.youtube.com/embed/Oh7F81326cU"
          title="DiveIntelligence tutorial video"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
        <Button variant="outlined" className="help-link" href="https://github.com/dylan-smith/DiveIntelligence/issues">
          <div className="issues">
            <div className="help-button-text">Bug Reports + Feature Requests</div>
            <img src="/assets/github-mark.svg" alt="github logo" />
          </div>
        </Button>
        <Button variant="outlined" className="help-link" href="https://github.com/dylan-smith/DiveIntelligence/discussions">
          <div className="issues">
            <div className="help-button-text">Q&amp;A + Discussion</div>
            <img src="/assets/github-mark.svg" alt="github logo" />
          </div>
        </Button>
      </div>
    </main>
  );
}
