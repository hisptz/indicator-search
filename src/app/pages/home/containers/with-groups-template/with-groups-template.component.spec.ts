import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WithGroupsTemplateComponent } from './with-groups-template.component';

describe('WithGroupsTemplateComponent', () => {
  let component: WithGroupsTemplateComponent;
  let fixture: ComponentFixture<WithGroupsTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WithGroupsTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WithGroupsTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
