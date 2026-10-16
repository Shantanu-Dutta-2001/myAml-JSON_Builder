import { TestBed } from '@angular/core/testing';
import { RouterTestingHarness } from '@angular/router/testing';
import { App } from './app';
import { appConfig } from './app.config';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: appConfig.providers,
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', async () => {
    const harness = await RouterTestingHarness.create('/');
    const compiled = harness.routeNativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Application Modeling');
  });

  it('should link to release notes from the header', async () => {
    const harness = await RouterTestingHarness.create('/');
    const pill = (harness.routeNativeElement as HTMLElement).querySelector('a.update-pill');
    expect(pill?.textContent).toContain('View Last Update');
    expect(pill?.getAttribute('target')).toBe('_blank');
  });

  it('should render release notes', async () => {
    const harness = await RouterTestingHarness.create('/release-notes');
    const compiled = harness.routeNativeElement as HTMLElement;
    expect(compiled.querySelector('.release-title')?.textContent).toContain('Release Note');
    expect(compiled.querySelectorAll('.release-card').length).toBeGreaterThan(0);
  });
});
