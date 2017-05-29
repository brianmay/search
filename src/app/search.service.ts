import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import { Site } from './site';

const sites = [
  {
    'id': 1,
    'siteName': 'SurferMag',
    'siteUrl': 'www.surfermag.com',
    'description': 'This is the description for SurferMag',
    'categoryIds': [
      2
    ]
  },
  {
    'id': 2,
    'siteName': 'Ebay',
    'siteUrl': 'www.ebay.com.au',
    'description': 'This is the description for ebay',
    'categoryIds': [
      1
    ]
  },
  {
    'id': 3,
    'siteName': 'Robs UI Tips',
    'siteUrl': 'www.awesomeui.com.au',
    'description': 'This is the description for the best site in the world. It is the best:)',
    'categoryIds': [
      4, 3
    ]
  },
  {
    'id': 4,
    'siteName': 'Table Tennis Tips - How to not come runners up',
    'siteUrl': 'www.ttt.com',
    'description': 'This is the description for Table Tennis Tips',
    'categoryIds': [
      1, 2, 3, 4
     ]
  }
];

const categories = [
  {
    id: 1,
    description: 'Arts & Entertainment'
  },
  {
    id: 2,
    description: 'Automotive'
  },
  {
    id: 3,
    description: 'Business'
  },
  {
    id: 4,
    description: 'Careers'
  }
];


@Injectable()
export class SearchService {

    constructor(private readonly http: Http) { }

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
        const split_terms = terms.split(',');
        for (const term of split_terms) {
            if (this.test_site_term(site, term.trim())) {
                return true;
            }
        }
        return false;
    }

    private decode_site(site: any): Site {
        const new_site = new Site();
        new_site.id = site.id;
        new_site.site_name = site.siteName;
        new_site.site_url = `https://${ site.siteUrl }/`;
        new_site.description = site.description;
        return new_site;
    }

    private decode_list(site_list: any): Site[] {
        const results = new Array<Site>();
        for (const site of site_list) {
            results.push(this.decode_site(site));
        }
        return results;
    }

    search(term: string): Observable<Site[]> {
        return this.http
               .get(`api/sites/?siteName=${term}`)
               .map(response => this.decode_list(response.json().data));
    }
}
