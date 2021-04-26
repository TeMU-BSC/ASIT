import { Injectable } from '@angular/core'
import { Title } from '@angular/platform-browser'
import { HttpClient } from '@angular/common/http'
import { Router, CanActivate } from '@angular/router'
import { MatDialog } from '@angular/material/dialog'
import { Observable } from 'rxjs'
import { ApiService } from './api.service'
import { ApiResponse, User } from '../models/interfaces'


@Injectable({
  providedIn: 'root'
})
export class AuthService implements CanActivate {

  browserStorageKey = 'temu_logged_annotator'
  user: User

  constructor(
    private http: HttpClient,
    private api: ApiService,
    private router: Router,
    public dialog: MatDialog,
    private title: Title,
  ) { }

  /**
   * Prevent loading certain pages without being logged in.
   */
  canActivate() {
    if (!this.isLoggedIn()) {
      this.router.navigate(['login'])
      return false
    }
    return true
  }

  public registerUsers(users: User[]): Observable<any> {
    return this.http.request<User[]>('post', `${this.api.url}/user`, { body: users })
  }

  public deleteUsers(users: User[]): Observable<ApiResponse> {
    return this.http.request<ApiResponse>('delete', `${this.api.url}/user`, { body: users })
  }

  public login(email: string, password: string): void {
    this.http.post<User>(`${this.api.url}/login`, { email, password }).subscribe(
      foundUser => {
        if (foundUser) {
          this.user = foundUser
          localStorage.setItem(this.browserStorageKey, JSON.stringify(this.user))
          this.title.setTitle(`Indizador - ${this.user.email}`)
          this.router.navigate(['docs'])
        }
      }
    )
  }

  public logout(): void {
    localStorage.removeItem(this.browserStorageKey)
    this.title.setTitle(`Indizador`)
    this.router.navigateByUrl('/')
  }

  public isLoggedIn(): boolean {
    return localStorage.getItem(this.browserStorageKey) !== null
  }

  public getCurrentUser(): User {
    return JSON.parse(localStorage.getItem(this.browserStorageKey))
  }

}
