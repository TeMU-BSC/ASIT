import { Injectable } from '@angular/core'
import { CanActivate } from '@angular/router'
import { AuthService } from './auth.service'

@Injectable({
  providedIn: 'root'
})
export class AuthAdminService implements CanActivate {

  roles = ['admin', 'tester']

  constructor(private auth: AuthService) { }

  canActivate() {
    return this.roles.includes(this.auth.getCurrentUser().role)
  }

}
