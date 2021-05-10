import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { questionnaireComponent } from './questionnaire.component';

describe('questionnaireComponent', () => {
  let component: questionnaireComponent;
  let fixture: ComponentFixture<questionnaireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ questionnaireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(questionnaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
