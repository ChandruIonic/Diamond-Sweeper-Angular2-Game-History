import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));
  it('should render title in a h1 tag', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Diamond Sweeper');
  }));

  it('Number of row', async(() => {
    let app = new AppComponent();    
    expect(app.board_row).toEqual(8);
  }));

  it('Number of column', async(() => {
    let app = new AppComponent();    
    expect(app.board_col).toBe(8);
  }));
});
