import {TestBed, async} from '@angular/core/testing';

import {Observable} from 'rxjs/Observable';

import {Site} from './site';
import {SearchService} from './search.service';
import {AppComponent} from './app.component';


class MockSearchService {
    search(term: string): Observable<Site[]> {
        const site = new Site();
        site.site_name = 'Name';
        site.site_url = 'https://www.google.com/';
        site.description = 'My description';
        return Observable.of([site]);
    }
}
describe('AppComponent', () => {
    beforeEach(async(() => {
        return TestBed.configureTestingModule({
            declarations: [
                AppComponent
            ],
            providers: [
                {provide: SearchService, useClass: MockSearchService},
            ]
        }).compileComponents();
    }));

    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app: AppComponent = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));

    it(`should have the correct title`, async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app: AppComponent = fixture.debugElement.componentInstance;
        expect(app.title).toEqual(
            'WGNHS - The Wild Goose-chase Needle in the Haystack Searcher');
    }));

    it('should be able to search', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const compiled = fixture.debugElement.nativeElement;
        const app: AppComponent = fixture.debugElement.componentInstance;

        // const input = compiled.querySelector('input');
        // input.value = 'search';
        // input.dispatchEvent(new Event('input'));
        app.search('meow');

        fixture.detectChanges();

        // FIXME: Fix the test
        // expect(compiled.querySelectorAll('div')[1].textContent).toContain('app works!');
    }));
});
