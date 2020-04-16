import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordAudioAndVideoComponent } from './record-audio-and-video.component';

describe('RecordAudioAndVideoComponent', () => {
  let component: RecordAudioAndVideoComponent;
  let fixture: ComponentFixture<RecordAudioAndVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordAudioAndVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordAudioAndVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
