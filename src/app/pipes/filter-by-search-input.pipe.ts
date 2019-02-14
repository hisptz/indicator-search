import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterBySearchInput'
})
export class FilterBySearchInputPipe implements PipeTransform {

  transform(indicators: any[], searchingText: any): any {
    if (searchingText !== undefined) {
      if (indicators.length > 0 && searchingText != '') {
        let splittedText = searchingText;
        [',', '[', ']', '(', ')', ',', '.', '-', '_'].forEach((char) => {
          splittedText = splittedText.split(char).join(' ');
        });
        return indicators.filter((indicator) => {
          let foundIndicatorMatchingSearchingInput = true;
          splittedText.split(' ').forEach((partOfSearchingText) =>{
            if (indicator.name.toLowerCase().indexOf(partOfSearchingText.toLowerCase()) === -1) {
              foundIndicatorMatchingSearchingInput = false;
            }
          });
          return foundIndicatorMatchingSearchingInput;
        });
      }
    }
    return indicators;
  }

}
