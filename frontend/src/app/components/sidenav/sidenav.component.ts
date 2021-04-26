import { Component, OnInit } from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {ChangeDetectorRef, OnDestroy} from '@angular/core';
import { AuthService } from 'src/app/services/auth.service'
import { externalLink } from 'src/app/helpers/constants'
import { NodeWithI18n } from '@angular/compiler';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnDestroy {

  link = externalLink

  mobileQuery: MediaQueryList;

  //fillerNav = Array.from({length: 50}, (_, i) => `Nav Item ${i + 1}`);
  fillerNav = [
    {name:"Home",route:"",icon:"home"},
    {name:"Terms",route:"",icon:"label"},
    {name:"Docs",route:"",icon:"article"},
    {name:"Users",route:"",icon:"manage_accounts"}
  ];



  fillerContent = ["Aca ira el admin panel"];

  private _mobileQueryListener: () => void;

  constructor(changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,public auth: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeListener(this._mobileQueryListener);
  }
  changeContent(nav){
    switch (nav) {
      case "Home":
        this.fillerContent = ["Home"];
        break;
        case "Terms":
          this.fillerContent = ["Terms"];
        break;
        case "Docs":
          this.fillerContent = ["Docs"];
        break;
        case "Users":
          this.fillerContent = ["User"];
        break;
      default:

        break;
    }

  }

  shouldRun = true;

}
