import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebrtcDataChannelComponent } from './webrtc-data-channel.component';

describe('WebrtcDataChannelComponent', () => {
  let component: WebrtcDataChannelComponent;
  let fixture: ComponentFixture<WebrtcDataChannelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebrtcDataChannelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebrtcDataChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
