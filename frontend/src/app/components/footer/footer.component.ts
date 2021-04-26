import { Component } from '@angular/core'
import { externalLink } from 'src/app/helpers/constants'

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  link = externalLink
}
