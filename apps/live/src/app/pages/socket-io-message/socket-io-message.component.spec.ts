import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SocketIoMessageComponent } from './socket-io-message.component';

describe('SocketIoMessageComponent', () => {
  let component: SocketIoMessageComponent;
  let fixture: ComponentFixture<SocketIoMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SocketIoMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocketIoMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
