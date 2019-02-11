import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';

@Pipe({
  name: 'filterGroups'
})
export class FilterGroupsPipe implements PipeTransform {

  transform(value: any, groups: any[] = []): any {
    if (groups.length !== 0) {
      return value.filter(( item ) => {
        return _.find(groups, (group) => {
          return _.find(item.indicatorGroups, {id: group.id});
        });
      });
    }
    return value;
  }

}
