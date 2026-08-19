import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoreAssistantLogin } from './store-assistant-login';

describe('StoreAssistantLogin', () => {
  let component: StoreAssistantLogin;
  let fixture: ComponentFixture<StoreAssistantLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StoreAssistantLogin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StoreAssistantLogin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
