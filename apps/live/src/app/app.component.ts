import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'live-video-example-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  constructor(
    private readonly titleService: Title,
    private route: ActivatedRoute,
    private readonly router: Router
  ) {}

  ngOnInit() {
    this.router.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
        let child = this.route.firstChild;
        while (child.firstChild) {
          child = child.firstChild;
        }
        const title = child.snapshot.data['title'];
        this.titleService.setTitle(title ?? 'ng app');
      }
    });
  }
}
