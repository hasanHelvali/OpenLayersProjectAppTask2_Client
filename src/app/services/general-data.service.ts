import { Injectable } from '@angular/core';
import { FeatureType } from '../components/map/map.component';
import WKT from 'ol/format/WKT';
import { IGeoLocation } from '../models/geo-location';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  _featureType: FeatureType;
  
  location:IGeoLocation;

  public _wkt:string
  getFeatureType(value: string) {
    for (const _type in FeatureType) {
      if (_type == value) {
        this._featureType = _type as FeatureType;
      }
    }
  }

  geometryToWkt(feature){
    var format = new WKT();
    const _wkt = format.writeGeometry(feature.getGeometry(), {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
    });
    this._wkt=_wkt;
  }

  setLocation(data:IGeoLocation){
    
    // this.location as Geolocation;
    // _data as Geolocation
    // this.location.type=_data.type
    // console.log(this.location.type);
    // console.log(_data);
    // this.location=_data;
    // _data.coordinates.forEach(element => {
    //   this.location.coordinates.push(element)
    // });
    // this.location.type=_type
    // this.location.coordinates=_data
    this.location=data;
    console.log(this.location);
    
  }
}
