import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JoinExistingComponent } from './join-existing.component';

describe('JoinExistingComponent', () => {
  let component: JoinExistingComponent;
  let fixture: ComponentFixture<JoinExistingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JoinExistingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JoinExistingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
