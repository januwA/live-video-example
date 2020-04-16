import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalVideoAudioComponent } from './local-video-audio.component';

describe('LocalVideoAudioComponent', () => {
  let component: LocalVideoAudioComponent;
  let fixture: ComponentFixture<LocalVideoAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalVideoAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalVideoAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
