import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { questionaireComponent } from './questionaire.component';

describe('questionaireComponent', () => {
  let component: questionaireComponent;
  let fixture: ComponentFixture<questionaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ questionaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(questionaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
