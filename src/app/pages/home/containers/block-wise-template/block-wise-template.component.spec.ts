import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockWiseTemplateComponent } from './block-wise-template.component';

describe('BlockWiseTemplateComponent', () => {
  let component: BlockWiseTemplateComponent;
  let fixture: ComponentFixture<BlockWiseTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlockWiseTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockWiseTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
