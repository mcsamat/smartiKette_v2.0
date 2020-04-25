import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmartmatchComponent } from './smartmatch.component';

describe('SmartmatchComponent', () => {
  let component: SmartmatchComponent;
  let fixture: ComponentFixture<SmartmatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmartmatchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmartmatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
