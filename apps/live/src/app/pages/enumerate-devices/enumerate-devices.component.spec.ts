import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumerateDevicesComponent } from './enumerate-devices.component';

describe('EnumerateDevicesComponent', () => {
  let component: EnumerateDevicesComponent;
  let fixture: ComponentFixture<EnumerateDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnumerateDevicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumerateDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
