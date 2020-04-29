import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualizzarticoloComponent } from './visualizzarticolo.component';

describe('VisualizzarticoloComponent', () => {
  let component: VisualizzarticoloComponent;
  let fixture: ComponentFixture<VisualizzarticoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisualizzarticoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualizzarticoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
