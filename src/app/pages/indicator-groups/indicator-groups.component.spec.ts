import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGroupsComponent } from './indicator-groups.component';

describe('IndicatorGroupsComponent', () => {
  let component: IndicatorGroupsComponent;
  let fixture: ComponentFixture<IndicatorGroupsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IndicatorGroupsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorGroupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
