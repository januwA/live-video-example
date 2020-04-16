import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetImageInVideoComponent } from './get-image-in-video.component';

describe('GetImageInVideoComponent', () => {
  let component: GetImageInVideoComponent;
  let fixture: ComponentFixture<GetImageInVideoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetImageInVideoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetImageInVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
