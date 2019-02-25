import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
    name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string, limite: string, searchWord: string): string {
        const limit = parseInt(limite, 0);
        if (value) {
            const limitStart = value.toUpperCase().indexOf(searchWord.toUpperCase());
            if (value.length > limit) {
                // tslint:disable-next-line:max-line-length
                return limitStart > 0 ? '...' + value.substring(limitStart - 30, limitStart) + '<b>' + value.substring(limitStart, limitStart + searchWord.length) + '</b>' + value.substring(limitStart + searchWord.length, limitStart + limit) + '...' : value.substring(0, limit) + '...';
            } else {
                // tslint:disable-next-line:max-line-length
                return limitStart >= 0 ? value.substring(0, limitStart) + '<b>' + value.substring(limitStart, limitStart + searchWord.length) + '</b>' + value.substring(limitStart + searchWord.length, limitStart + limit) : value;
            }
        }
    }
}
