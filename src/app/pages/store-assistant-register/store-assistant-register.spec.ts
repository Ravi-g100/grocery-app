import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAssistantRegister } from './store-assistant-register';

describe('StoreAssistantRegister', () => {
  let component: StoreAssistantRegister;
  let fixture: ComponentFixture<StoreAssistantRegister>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreAssistantRegister]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreAssistantRegister);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
