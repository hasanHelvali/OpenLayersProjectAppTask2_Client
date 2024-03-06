import { Injectable } from '@angular/core';
import { GeoLocation } from '../models/geo-location';
import { LocAndUsers } from '../models/locAndUsers';
import { Subject } from 'rxjs';
import { Observable } from 'ol';
import WKT from 'ol/format/WKT';
import { Geometry } from 'ol/geom';

@Injectable({
  providedIn: 'root'
})
export class LocDataService {
  public veriOlusturulduSubject = new Subject<any>()
  data:GeoLocation

  data2:LocAndUsers

  listLocAndUser:LocAndUsers[]=[];

  getGeometryByWkt:string;
  constructor() {
   }

   getGeometryBywkt(_wkt){
    // this._options="";
    // this.isFeatureMapActive=true
    const wkt = _wkt
    console.log(wkt);
    const format=new WKT();
    const feature = format.readFeature(wkt, {
      dataProjection: 'EPSG:4326',
      featureProjection: 'EPSG:3857'
  });
    var geometry = feature.getGeometry() as Geometry;
    // console.log(geometry)
    // console.log(geometry.getCoordinates())
    //  const map = new Map({
    //   layers: [raster, vector],
    //   target: 'map', // Harita bileşeninin ID'si
    //   view: new View({
    //     center: fromLonLat([34.9998,39.42152]),
    //     zoom: 6.8,
    //   }),
    // });
  }

}
