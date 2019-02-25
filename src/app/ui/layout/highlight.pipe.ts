import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'highlight'
})
export class HighlightPipe implements PipeTransform {
    transform(value: string, searchWord: string): string {
        if (value) {
            const ocurrences = [];
            let pos = value.toUpperCase().indexOf(searchWord.toUpperCase());
            let finalString = '';
            let lastPosition = 0;
            while (pos !== -1) {
                ocurrences.push(pos);
                // tslint:disable-next-line:max-line-length
                finalString = finalString + value.substring(lastPosition, pos) + '<b>' + value.substring(pos, pos + searchWord.length) + '</b>';
                lastPosition = pos + searchWord.length;
                pos = value.toUpperCase().indexOf(searchWord.toUpperCase(), pos + 1);
            }
            finalString = finalString + value.substring(lastPosition, value.length);
            return finalString;
        }
    }
}

