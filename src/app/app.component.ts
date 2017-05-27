import { Component, OnInit } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

import { Site } from './site';
import { SearchService } from './search.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    title = 'WGNHS - The Wild Goose-chase Needle in the Haystack Searcher';

    results: Observable<Site[]>;
    private search_terms = new Subject<string>();

    constructor(
      private readonly search_service: SearchService
    ) {}

  ngOnInit(): void {
      this.results = this.search_terms
        .debounceTime(300)        // wait 300ms after each keystroke before considering the term
        .distinctUntilChanged()   // ignore if next search term is same as previous
        .switchMap(term => term   // switch to new observable each time the term changes
          // return the http search observable
          ? this.search_service.search(term)
          // or the observable of empty results if there was no search term
          : Observable.of<Site[]>([]))
        .catch(error => {
          // TODO: add real error handling
          console.log(error);
          return Observable.of<Site[]>([]);
        });
    }

  // Push a search term into the observable stream.
  search(terms: string): void {
    this.search_terms.next(terms);
  }
}
