import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetAudioComponent } from './get-audio.component';

describe('GetAudioComponent', () => {
  let component: GetAudioComponent;
  let fixture: ComponentFixture<GetAudioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
