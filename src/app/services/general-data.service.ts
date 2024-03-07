import { Injectable } from '@angular/core';
import { FeatureType } from '../components/map/map.component';
import WKT from 'ol/format/WKT';
import { IGeoLocation } from '../models/geo-location';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  public veriOlusturulduSubject = new Subject<any>()
  public closedModal = new Subject<any>()
  public createdFeature = new Subject<any>()
  // public modalAc = new Subject<any>()
  _featureType: FeatureType;
  isModalActive:boolean=false;;
  location:IGeoLocation;
  isOptionActive:boolean=false;
  public _wkt:string


  options = [
    // { value: 'default', text: '--Seçiniz--' },
    { value: 'Point', text: 'Point' },
    { value: 'LineString', text: 'LineString' },
    { value: 'Polygon', text: 'Polygon' },
    { value: 'Circle', text: 'Circle' },
  ];
  
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
    this.location=data;
    this.isModalActive=true;
  }
}
