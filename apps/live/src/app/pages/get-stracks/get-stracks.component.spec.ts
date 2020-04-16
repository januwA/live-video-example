import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetStracksComponent } from './get-stracks.component';

describe('GetStracksComponent', () => {
  let component: GetStracksComponent;
  let fixture: ComponentFixture<GetStracksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetStracksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetStracksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
