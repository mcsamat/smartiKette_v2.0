import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewlabelComponent } from './viewlabel.component';

describe('ViewlabelComponent', () => {
  let component: ViewlabelComponent;
  let fixture: ComponentFixture<ViewlabelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewlabelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewlabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
