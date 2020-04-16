import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordDesktopComponent } from './record-desktop.component';

describe('RecordDesktopComponent', () => {
  let component: RecordDesktopComponent;
  let fixture: ComponentFixture<RecordDesktopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RecordDesktopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordDesktopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
