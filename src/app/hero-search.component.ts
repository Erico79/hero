import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';

// Observable class extensions
import 'rxjs/add/observable/of';

// Observable operators
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';

import {HeroSearchService} from './hero-search.service';
import {Hero} from './hero';

@Component({
  selector: 'hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css'],
  providers: [HeroSearchService]
})
export class HeroSearchComponent implements OnInit {
  heroes: Observable<Hero[]>;
  private searchTerms = new Subject<string>(); // a subject is a producer of an obervable event steam;
  // searchTerms produces an Observable of strings, the filter criteria for the name search.

  constructor(
    private heroSearchService: HeroSearchService,
    private router: Router
  ) {}

  /**
   * Each call to the search() puts a new string into this subject's observable stream by calling next
   * @param term
   */
  search(term: string): void {
    // push the search term into the observable stream.
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes = this.searchTerms.debounceTime(300) // wait 300ms after each keystroke before considering the term
      .distinctUntilChanged() // ignore if next search term is same as previous
      // switch to new observable each time the term changes return the http search observable
      // or the observable of empty heroes if there was no search term
      .switchMap(term => term ? this.heroSearchService.search(term) : Observable.of<Hero[]>([]))
      .catch(error => {
        // TODO: add real error handling
        console.log(error);
        return Observable.of<Hero[]>([]);
      });
  }

  goToDetail(hero: Hero): void {
    const link = ['/detail', hero.id];
    this.router.navigate(link);
  }
}
