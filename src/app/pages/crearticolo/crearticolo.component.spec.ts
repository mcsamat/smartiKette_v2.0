import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearticoloComponent } from './crearticolo.component';

describe('CrearticoloComponent', () => {
  let component: CrearticoloComponent;
  let fixture: ComponentFixture<CrearticoloComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearticoloComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearticoloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
