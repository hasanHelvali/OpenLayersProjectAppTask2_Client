import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  Type,
  numberAttribute,
} from '@angular/core';
import Map from 'ol/Map';
import { Draw, Modify, Snap } from 'ol/interaction';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import { fromLonLat, get } from 'ol/proj';
import OSM from 'ol/source/OSM';
import VectorSource from 'ol/source/Vector';
import { MyModalComponent } from '../my-modal/my-modal.component';
import { LocDataService } from 'src/app/services/loc-data.service';
import { Circle, Geometry, LineString, Point, Polygon } from 'ol/geom';
import { BaseComponent } from 'src/app/common/base/base.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { GeneralDataService } from 'src/app/services/general-data.service';
import Style from 'ol/style/Style';
import Stroke from 'ol/style/Stroke';
import Fill from 'ol/style/Fill';
import { Collection, Observable, View } from 'ol';
import { LocalizedString } from '@angular/compiler';
import { IGeoLocation } from 'src/app/models/geo-location';
import Layer from 'ol/layer/Layer';
import BaseLayer from 'ol/layer/Base';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { GeometryListModalComponent } from '../geometry-list-modal/geometry-list-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { format } from 'ol/coordinate';
import WKT from 'ol/format/WKT';
import VectorImageLayer from 'ol/layer/VectorImage';
import { UpdateModalComponent } from '../update-modal/update-modal.component';
import { UpdateLocation } from 'src/app/models/updateLocation';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent extends BaseComponent implements OnInit {
  map: Map;
  vectorLayer: any;
  options = "";
  isOptionActive:boolean=false;
  locAndUsersList:LocAndUsers[];
  snap:any;
  isFeatureChanged=false;
  constructor(
    ngxSpinner: NgxSpinnerService,
    public generalDataService: GeneralDataService,
    public mymodal: MyModalComponent,
    public locDataService: LocDataService,
    private httpCLientService:CustomHttpClient,
    private geometryListModal:GeometryListModalComponent,
    public dialog: MatDialog,
    public updateModal:UpdateModalComponent,
    private readonly changeDetectorRef: ChangeDetectorRef
    ) {
      super(ngxSpinner);
      
    }
    // var draw, snap; 
    // getGeometryByWkt(veri) {}
    
  ngOnInit(): void {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM(),
        }),
      ],
      view: new View({
        center: fromLonLat([34.9998, 39.42152]),
        zoom: 6.8,
      }),
    });
    this.addLayer(); //haritaya bir layer eklendi.
    // this.locDataService.veriOlusturulduSubject.subscribe((veri) => {
    //   console.log('veri geldi');
    // });
    this.generalDataService.veriOlusturulduSubject.subscribe({
      next:()=>{
      this.clearFeature();//fetaure ların silinecegi fonskiyon burada tanımlandı.
      this.clearInteraction();
      // this.generalDataService.isOptionActive=false;
      },
      error:()=>{
        alert("Veri Gelmedi.");
        this.clearFeature();//fetaure ların silinecegi fonskiyon burada tanımlandı.
        this.clearInteraction();
      }
    });
    this.generalDataService.closedModal.subscribe({
      next:()=>{
      this.clearInteraction();
      this.clearFeature();
      },
      error:()=>{
        alert("Veri Gelmedi.");
        this.clearInteraction();
        this.clearFeature();
      }
    });
    this.generalDataService.selectedOptions.subscribe({
      next:(data)=>{
        this.options=data
        },
        error:()=>{
        }
    });
    this.generalDataService.mapFeature.subscribe({
      next:(data)=>{
        const _data=data as UpdateLocation;
        console.log("data-"+data);
        this.wktToMapFeature(_data);
        // this.clearInteraction();
        // this.clearFeature();
        },
        error:()=>{
          alert("Veri Gelmedi.");
          this.clearInteraction();
          this.clearFeature();
        }
    });
    this.generalDataService.featureUpdate.subscribe({
      next:(data)=>{
        this.isFeatureChanged=data as boolean
        this.changeDetectorRef.detectChanges()
        },
    });
  }
  addLayer() {
    this.vectorLayer = new VectorLayer({
      source: new VectorSource(),
      style: {
        'fill-color': 'rgba(255, 255, 255, 0.2)',
        'stroke-color': '#ffcc33',
        'stroke-width': 2,
        'circle-radius': 7,
        'circle-fill-color': '#ffcc33',
      },
      className: 'vecLay',
    });
    this.map.addLayer(this.vectorLayer);
  }
  addFeature(value: string) {
    this.vectorLayer.getSource().clear();
    this.options=""
    this.generalDataService.selectedOptions.next(value)
    let that = this;
    this.generalDataService.getFeatureType(value); //service deki feature tipini guncellestiriyorum.
    const drawInteraction = new Draw({
      type: this.generalDataService._featureType, // Çizilebilecek şekil türünü (Point, LineString, Polygon) seciyorum
    });
    that.map.removeInteraction(drawInteraction)
    this.map.addInteraction(drawInteraction); //interaction i map e ekliyorum.
    // vectorLayer.getSource().clear()
    this.map.on('click', (event) => {
      //her click edildiginde
      const coordinateLong = event.coordinate[0];
      const coordinateLat = event.coordinate[1];
    });

    drawInteraction.on('drawend', function (event) {
      that.generalDataService.setLocation(null);
      that.generalDataService._wkt=null;
      //cizim bittiginde
      that.clearFeature() 
      var feature = event.feature;
      const _type: FeatureType = event.feature
        .getGeometry()
        .getType() as FeatureType;
      if(feature){
        that.generalDataService.createdFeature.next("Feature Olusturuldu.");
      }
      that.vectorLayer.getSource().addFeature(feature);
      var geometry = feature.getGeometry() as any;
      const data: IGeoLocation = {
        type: geometry.getType(),
        coordinates: geometry.getCoordinates(),
      };
      that.generalDataService.geometryToWkt(feature); //service class ında bir property ye wkt verisi aktarıldı.
      that.generalDataService.setLocation(data);
      // Burada ilgili service yapısına datalar gonderildigi anda ilgili coordinates modalı acılır.
    });
  }
  clearFeature() {
    this.vectorLayer.getSource().clear();//Burada source icinde ki feature lar temizlendi.
  }
  clearInteraction(){
    this.map.getInteractions().clear();
  }

  getGeometryListModal(){
    this.geometryListModal.openModal()
  }

  openDilaog(){
    this.showSpinner();
    this.httpCLientService.get<LocAndUsers>({controller:"maps"}).subscribe({
      next:(data:LocAndUsers[])=>{
        this.generalDataService.listData.next(data);
        
        this.generalDataService.getGeometryListModal()//Modal Acılıyor.
        this.hideSpinner()
        const dialogRef = this.dialog.open(GeometryListModalComponent,{
        });
        dialogRef.afterClosed().subscribe(result => {
          // console.log(`Dialog result: ${result}`);
        });
      },
      error:(err)=>{
        this.hideSpinner()
        //Yapılacak Baska İşlemler de var.
      }
    });
  }

  openChangeDialog(){
    // this.mymodal.updateModal();
    this.generalDataService.featureUpdate.next(true);
    this.updateModal.openModal()
  }

  wktToMapFeature(_data:UpdateLocation){
    this.vectorLayer.getSource().clear();
    var format=new WKT();
    const feature = format.readFeature(_data.wkt,{
      dataProjection:'EPSG:4326',
      featureProjection: 'EPSG:3857'
    })
    console.log(feature);
    const source =this.vectorLayer.getSource();
    source.addFeature(feature);
    this.map.getView().fit(feature.getGeometry() as any,{padding:[40,40,40,40],duration:1000})    

    const modify = new Modify({source: source});
    this.map.addInteraction(modify);
    this.snap = new Snap({source: source});
    this.map.addInteraction(this.snap);
    //Feature da degisiklik yapılmasına olanak saglayan yapılar bunlardır.

    modify.on('modifystart', () => {
      console.log("-------------");
      this.isFeatureChanged=true;
      this.changeDetectorRef.detectChanges()
      // feature.modified = true; // Özelliği güncelleme
    });
    modify.on('modifyend', () => {
      console.log("-------------");
      this.generalDataService.featureUpdate.next(true);
      // this.isFeatureChanged=true
      var geometry = feature.getGeometry() as any;
      const data: IGeoLocation = {
        type: geometry.getType(),
        coordinates: geometry.getCoordinates(),
      };

      this.generalDataService.updatedLocation=data;
      _data.type=data.type;
      _data.coordinates=data.coordinates;
      //Elde edilen son geometri verisini wkt ye tekrardan cast etmem gerek
      _data.wkt=this.generalDataService.updateGeometryToWkt(feature);
      this.generalDataService.featureUpdateGeneralData.next(_data);

      // Değişiklikler tamamlandı
    });
}
  }
export enum FeatureType {
  Circle = 'Circle',
  LineString = 'LineString',
  Point = 'Point',
  Polygon = 'Polygon',
}
