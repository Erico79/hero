import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import {Hero} from './hero';
import {Http} from '@angular/http';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class HeroService {
  private heroesUrl = 'api/heroes'; // url to web api

  constructor(private http: Http) {}

  getHero(id: number): Promise<Hero> {
    return this.getHeroes()
      .then(heroes => heroes.find(hero => hero.id === id));
  }

  getHeroes(): Promise<Hero[]> {
    return this.http.get(this.heroesUrl)
      .toPromise()
      .then(response => response.json().data as Hero[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.log('An error occurred', error); //
    return Promise.reject(error.message || error);
  }

  getHeroesSlowly(): Promise<Hero[]> {
    return new Promise(resolve => {
      // simulate server latency with 2 seconds delay
      setTimeout(() => resolve(this.getHeroes()), 2000);
    });
  }
}
