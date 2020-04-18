import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebrtcP2pMediaControlComponent } from './webrtc-p2p-media-control.component';

describe('WebrtcP2pMediaControlComponent', () => {
  let component: WebrtcP2pMediaControlComponent;
  let fixture: ComponentFixture<WebrtcP2pMediaControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebrtcP2pMediaControlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebrtcP2pMediaControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
