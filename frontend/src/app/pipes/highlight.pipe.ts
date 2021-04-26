// import { Pipe, PipeTransform } from '@angular/core'
// import { toRegex } from 'diacritic-regex'
// import { removeConsecutiveSpaces } from '../helpers/functions'

// @Pipe({
//   name: 'highlight'
// })
// export class HighlightPipe implements PipeTransform {

//   specialCharacters = ['+', '-', '(', ')', '[', ']', '.', '*', '?', '$']

//   transform(value: string, search: string): string {
//     let regex: RegExp
//     if (search) {
//       search = removeConsecutiveSpaces(search)
//       this.specialCharacters.forEach(char => search = search.replace(char, `\\${char}`))
//       regex = toRegex()(search)
//     }
//     return value.replace(regex, '<strong>$&</strong>')
//   }

// }
