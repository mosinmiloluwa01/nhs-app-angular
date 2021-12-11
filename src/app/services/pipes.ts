import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'elipses20' })
export class ElipsesPipeTwenty implements PipeTransform {
  transform(value: any) {
    if (value.length >= 21) {
      let a = value.toString().substr(0, 21)
      return `${a}...`
    }
    return value;
  }
}
@Pipe({ name: 'elipses30' })
export class ElipsesPipeThirty implements PipeTransform {
  transform(value: any) {
    if (value.length >= 29) {
      let a = value.toString().substr(0, 27)
      return `${a}...`
    }
    return value;
  }
}
@Pipe({ name: 'elipses50' })
export class ElipsesPipeFifty implements PipeTransform {
  transform(value: any) {
    if (value.length >= 50) {
      let a = value.toString().substr(0, 50)
      return `${a}...`
    }
    return value;
  }
}