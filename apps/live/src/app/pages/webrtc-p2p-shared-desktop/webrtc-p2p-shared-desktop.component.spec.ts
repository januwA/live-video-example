import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebrtcP2pSharedDesktopComponent } from './webrtc-p2p-shared-desktop.component';

describe('WebrtcP2pSharedDesktopComponent', () => {
  let component: WebrtcP2pSharedDesktopComponent;
  let fixture: ComponentFixture<WebrtcP2pSharedDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebrtcP2pSharedDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebrtcP2pSharedDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
