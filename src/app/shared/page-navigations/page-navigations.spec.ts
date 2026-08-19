import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PageNavigations } from './page-navigations';

describe('PageNavigations', () => {
  let component: PageNavigations;
  let fixture: ComponentFixture<PageNavigations>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PageNavigations]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PageNavigations);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
