import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  initialDeviceType: string = 'desktop'

  private newDeviceType = new BehaviorSubject<string>(this.initialDeviceType);

  currentDeviceType = this.newDeviceType.asObservable();

  constructor() { }

  setCurrentDeviceType(data: string) {
    this.newDeviceType.next(data);
  }
}
