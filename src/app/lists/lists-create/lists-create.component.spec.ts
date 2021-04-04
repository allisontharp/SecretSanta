import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListsCreateComponent } from './lists-create.component';

describe('ListsCreateComponent', () => {
  let component: ListsCreateComponent;
  let fixture: ComponentFixture<ListsCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListsCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListsCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
