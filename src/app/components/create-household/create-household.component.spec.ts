import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateHouseholdComponent } from './create-household.component';

describe('CreateHouseholdComponent', () => {
  let component: CreateHouseholdComponent;
  let fixture: ComponentFixture<CreateHouseholdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateHouseholdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateHouseholdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
