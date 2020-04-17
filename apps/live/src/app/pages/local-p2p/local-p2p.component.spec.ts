import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocalP2pComponent } from './local-p2p.component';

describe('LocalP2pComponent', () => {
  let component: LocalP2pComponent;
  let fixture: ComponentFixture<LocalP2pComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocalP2pComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocalP2pComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
