import { Injectable } from '@angular/core';
import { FeatureType } from '../components/map/map.component';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  _featureType: FeatureType;

  getFeatureType(value: string) {
    for (const _type in FeatureType) {
      if (_type == value) {
        this._featureType = _type as FeatureType;
      }
    }
  }
}
