import { Router } from '@angular/router';
import { AuthService } from './auth/auth.service';
import { AppService } from './app.service';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MediaMatcher } from '@angular/cdk/layout';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy, OnInit {
  loading: boolean;
  mobileQuery: MediaQueryList;
  appTitle = 'Mobile Cash Desk DB';

  fillerNav = [
    {
      caption: 'Items',
      path: 'item-list'
    },
    {
      caption: 'Companies',
      path: 'company-list'
    }
  ];

  private _mobileQueryListener: () => void;

  public get currentUser() {
    return this.appService.currentUser;
  }

  public get logoutButtonDisabled(): boolean {
    return !this.currentUser;
  }

  public get menuButtonDisabled(): boolean {
    return !this.currentUser;
  }

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private media: MediaMatcher,
    private appService: AppService,
    private authService: AuthService,
    private router: Router
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.getCurrentUser();
  }

  getCurrentUser() {
    this.loading = true;
    const finalize = () => this.loading = false;
    this.authService.getCurrentUser()
      .subscribe(user => {
        this.appService.currentUser = user;
        finalize();
      }, finalize, finalize);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }

  logOut() {
    this.authService.logOut().subscribe(() => {
      this.appService.currentUser = null;
      this.router.navigate(['login']);
    });
  }

}
