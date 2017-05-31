import {TestBed, inject} from '@angular/core/testing';
import {HttpModule, Response, ResponseOptions, XHRBackend} from '@angular/http';
import {MockBackend} from '@angular/http/testing';

import {sites} from './data';
import {Site} from './site';
import {SearchService} from './search.service';


describe('SearchService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpModule],
            providers: [
                SearchService,
                {provide: XHRBackend, useClass: MockBackend},
            ]
        });
    });

    it('should make get request',
        inject([SearchService, XHRBackend], (service: SearchService, mockBackend: MockBackend) => {
            const mockResponse = {
                data: sites,
            };

            mockBackend.connections.subscribe((connection) => {
                expect(connection.request.url).toMatch(
                    /api\/sites\/\?q=search$/, 'url invalid');
                    // /\?q=search$/, 'url invalid');
            });

            service.search('search').subscribe((sites: Site[]) => {
                expect(sites.length).toBe(4);
                expect(sites[0].site_name).toEqual('SurferMag');
            });

        }));

    it('should return an Observable<Site>',
        inject([SearchService, XHRBackend], (service: SearchService, mockBackend: MockBackend) => {
            const mockResponse = {
                data: sites,
            };

            mockBackend.connections.subscribe((connection) => {
                connection.mockRespond(new Response(new ResponseOptions({
                    body: JSON.stringify(mockResponse)
                })));
            });

            service.search('search').subscribe((sites: Site[]) => {
                expect(sites.length).toBe(4);
                expect(sites[0].site_name).toEqual('SurferMag');
                expect(sites[0].site_url).toEqual('https://www.surfermag.com/');
            });

        }));
});
