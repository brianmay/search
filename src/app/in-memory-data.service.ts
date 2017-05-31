import {
    InMemoryDbService,
    createErrorResponse,
    emitResponse,
    HttpMethodInterceptorArgs,
    STATUS
} from 'angular-in-memory-web-api';
import {Response, ResponseOptions} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Observer} from 'rxjs/Observer';

import { sites, categories} from './data';

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        return {sites};
    }

    private get_category(id: number): any {
        for (const category of categories) {
            if (category.id === id) {
                return category;
            }
        }
        return null;
    }

    private test_site_term(site: any, term: string): boolean {
        const lc_term = term.toLowerCase();
        const lc_site_name = site.siteName.toLowerCase();

        if (!term) {
            return false;
        }

        let found = false;
        if (lc_site_name.includes(lc_term)) {
            found = true;
        }

        for (const category_id of site.categoryIds) {
            const category = this.get_category(category_id);
            if (category != null) {
                const lc_category_description = category.description.toLowerCase();
                if (lc_category_description.includes(lc_term)) {
                    found = true;
                }
            }
        }

        return found;
    }

    private test_site_terms(site: any, terms: string): boolean {
        if (terms == null) {
            return false;
        }
        const split_terms = terms.split(',');
        for (const term of split_terms) {
            if (this.test_site_term(site, term.trim())) {
                return true;
            }
        }
        return false;
    }

    private search(collection: any, terms: string): any[] {
        const results = [];
        for (const site of collection) {
            if (this.test_site_terms(site, terms)) {
                results.push(site);
            }
        }
        return results;
    }

    get(interceptorArgs: HttpMethodInterceptorArgs): Observable<Response> {
        // Returns a "cold" observable that won't be executed until something subscribes.
        return new Observable<Response>((responseObserver: Observer<Response>) => {
            let resOptions: ResponseOptions;

            const {id, query, collection, collectionName, headers, req} = interceptorArgs.requestInfo;
            let data = collection;

            if (id) {
                // FIXME: Not implemented yet.
                // data = this.findById(collection, id);
                data = null;
            } else if (query) {
                // data = this.applyQuery(collection, query);
                data = this.search(collection, query.get('q'));
            }

            if (data) {
                resOptions = new ResponseOptions({
                    body: {data: data},
                    headers: headers,
                    status: STATUS.OK
                });
            } else {
                resOptions = createErrorResponse(req, STATUS.NOT_FOUND,
                    `'${collectionName}' with id='${id}' not found`);
            }

            emitResponse(responseObserver, req, resOptions);
            return () => {
            }; // unsubscribe function
        });
    }
}
