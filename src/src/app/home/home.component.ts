import { Component, OnInit, inject } from '@angular/core';
import { ApplicationInsightsService } from '../application-insights-service/application-insights.service';
import { MatButton } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { YouTubePlayer } from '@angular/youtube-player';

@Component({
  selector: 'dive-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  imports: [MatButton, RouterLink, YouTubePlayer],
})
export class HomeComponent implements OnInit {
  ngOnInit() {
    let apiLoaded = false;

    if (!apiLoaded) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      document.body.appendChild(tag);
      apiLoaded = true;
    }
  }

  constructor() {
    const window = inject(Window);
    const appInsights = inject(ApplicationInsightsService);

    appInsights.trackEvent('ResolutionInfo', {
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      devicePixelRatio: window.devicePixelRatio,
      screenWidth: window.screen.width,
      screenHeight: window.screen.height,
      orientation: window.screen.orientation,
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    });
  }
}
