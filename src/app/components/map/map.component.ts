import {
  ChangeDetectionStrategy,
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
import { Collection, View } from 'ol';
import { LocalizedString } from '@angular/compiler';
import { IGeoLocation } from 'src/app/models/geo-location';
import Layer from 'ol/layer/Layer';
import BaseLayer from 'ol/layer/Base';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { GeometryListModalComponent } from '../geometry-list-modal/geometry-list-modal.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapComponent extends BaseComponent implements OnInit {
  //#region
  // constructor(private httpCLient:CustomHttpClient,private modalComponent: MyModalComponent,
  //   public locDataService:LocDataService, private listModalComponent:GeometryListModalComponent,spinner:NgxSpinnerService) {
  //     super(spinner)
  //     this.locDataService.veriOlusturulduSubject.subscribe((veri)=>{
  //       console.log("veri geldi");
  //       this.getGeometryBywkt(veri);----------------------------------------------------------------------------------------------------------------------------

  //     })

  // }

  // data:any=null;
  // data2:any=null;
  // _type: Type;
  // mapİsActive:boolean=false;
  // map:Map;
  // _featureMap:Map;
  // isCheck:boolean=false;
  // isFeatureMapActive:boolean=false;
  // onChanges() {
  //   if(this.isFeatureMapActive==true){
  //     this.disposeMap(this._featureMap)
  //   }
  //   for (const opt in Type) {
  //       //bir değisiklik yapıldıysa
  //       this.mapİsActive=true;
  //       this.disposeMap(this.map);
  //       this.data=null;
  //       this.locDataService.data=null;
  //       this.locDataService.data2=null;
  //     }
  //   }

  // }
  // disposeFeatureMap(){
  //   if(this.isFeatureMapActive==true){
  //     this.disposeMap(this._featureMap)
  //     this.ngOnInit()
  //   }
  // }
  // ngOnInit() {
  //  this.getMap(Type.Point);
  // }

  // mapDraw(draw):any{
  //   //This keyword unu degistirdim.
  //   let _that=this;-
  //   this.map.on('click', (event) => {
  //     const coordinateLong = event.coordinate[0];
  //     const coordinateLat = event.coordinate[1];
  //     console.log('Tıklanan konum:', [coordinateLong,coordinateLat]);
  //     });
  //     draw.on('drawend', function(event) {
  //       var feature = event.feature;
  //       console.log(feature);

  //       var geometry = feature.getGeometry();

  //      const daataa={
  //       type:geometry.getType(),
  //       coordinates:geometry.getCoordinates()
  //     };
  //     var format = new WKT();
  //     const _wkt = format.writeGeometry(feature.getGeometry(), {
  //       dataProjection: 'EPSG:4326',
  //       featureProjection: 'EPSG:3857'
  //     });
  //     const _data2={
  //       wkt:_wkt
  //     }
  //     console.log(_wkt);
  //     // console.log(typeof(_wkt));
  //       console.log();
  //       _that.data=daataa;
  //       _that.data2=_data2;
  //       console.log(_that.data);

  //       _that.locDataService.data=_that.data;
  //       _that.locDataService.data2=_that.data2;

  //       // console.log(_that.locDataService.data);
  //       console.log(_that.locDataService.data2);

  //     });
  // }
  // getMap(type:Type){
  //   var raster = this.createRaster();
  //   var source=this.createSource();
  //   var vector=this.createVector(source);
  //   var extent=this.createExtent();
  //   this.map=this.createMap(raster,vector,extent);
  //   var modify=this.createModify(source);
  //   this.map.addInteraction(modify);
  //   var draw = this.createDraw(source,type)
  //   this.addInteractions(draw,source)
  //   this.mapDraw(draw)
  //   this.isFeatureMapActive=false;
  // }
  // addInteractions(draw,source) {
  //   let snap;
  //   // draw = new Draw({
  //   //   source: source,
  //   //   type: type,
  //   // });
  //   this.map.addInteraction(draw);
  //   snap = new Snap({source: source});
  //   this.map.addInteraction(snap);
  // }
  // createDraw(source,type):Draw{
  //   var draw = new Draw({
  //     source: source,
  //     type: type,
  //   });
  //   return draw
  // }

  // createRaster():TileLayer<OSM>{
  //   var raster = new TileLayer({
  //     source: new OSM(),
  //   });
  //   return raster;
  // }
  // createMap(raster,vector,extent):Map{
  //   var map = new Map({
  //     layers: [raster, vector],
  //     target: 'map',
  //     view: new View({
  //       center: fromLonLat([34.9998,39.42152]),
  //       zoom: 6.8,
  //       extent,
  //     }),
  //   });
  //   return map;
  // }

  // createExtent():number[]{
  //   var extent = get('EPSG:3857').getExtent().slice();
  //   extent[0] += extent[0];
  //   extent[2] += extent[2];
  //   return extent;
  // }

  // createModify(source):Modify{
  //   var modify = new Modify({source: source});
  //   return modify;
  // }

  // createSource():VectorSource{
  //   var source = new VectorSource();
  //   return source;
  // }
  // createVector(source):VectorLayer<any>{
  //   var vector = new VectorLayer({
  //     source: source,
  //     style: {
  //       'fill-color': 'rgba(255, 255, 255, 0.2)',
  //       'stroke-color': '#ffcc33',
  //       'stroke-width': 2,
  //       'circle-radius': 7,
  //       'circle-fill-color': '#ffcc33',
  //     },
  //   });
  //   return vector;
  // }

  // disposeMap(map:Map){
  //   map.dispose();
  //   this.mapİsActive=false;
  // }

  // (){
  //   this.showSpinner();
  //   this.httpCLient.get<LocAndUsers>({controller:"maps"}).subscribe({
  //     next:(data)=>{
  //       this.locDataService.listLocAndUser=data;
  //       this.hideSpinner();
  //       this.listModalComponent.openModal();
  //       this._options="";
  //     },
  //     error:(err)=>{
  //       alert("Bir Hata Oluştu.")
  //     }
  //   });
  // }

  // getGeometryBywkt(_wkt){
  //   console.log("++++++++");
  //   this._options="";
  //   this.isFeatureMapActive=true
  //   this.disposeMap(this.map);
  //   var map;

  //   const wkt = _wkt
  //   console.log(wkt);

  //   const format=new WKT();

  //   // var raster = this.createRaster();
  //   // var source=this.createSource();
  //   const feature = format.readFeature(wkt, {
  //     dataProjection: 'EPSG:4326',
  //     featureProjection: 'EPSG:3857'
  // });

  //   // this.map.addLayer(vectorLayer);

  //   // const feature = format.readFeature(wkt, {
  //   //   dataProjection: 'EPSG:4326',
  //   //   featureProjection: 'EPSG:3857',
  //   // });

  //   var geometry = feature.getGeometry() as Geometry;
  //   // console.log(geometry)
  //   // console.log(geometry.getCoordinates())
  //   //  const map = new Map({
  //   //   layers: [raster, vector],
  //   //   target: 'map', // Harita bileşeninin ID'si
  //   //   view: new View({
  //   //     center: fromLonLat([34.9998,39.42152]),
  //   //     zoom: 6.8,
  //   //   }),
  //   // });
  //     this._featureMap=this.featureMap(raster,vector);
  // }

  //#region

  map: Map;
  vectorLayer: any;
  options = "";
  isOptionActive:boolean=false;
  locAndUsersList:LocAndUsers[];
  constructor(
    ngxSpinner: NgxSpinnerService,
    public generalDataService: GeneralDataService,
    public mymodal: MyModalComponent,
    public locDataService: LocDataService,
    private httpCLientService:CustomHttpClient,
    private geometryListModal:GeometryListModalComponent,
    public dialog: MatDialog
  ) {
    super(ngxSpinner);

  }
  getGeometryByWkt(veri) {}

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
    //   this.removeFeature();
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
    this.options="none"
    this.generalDataService.selectedOptions.next(value)
    let that = this;
    this.generalDataService.getFeatureType(value); //service deki feature tipini guncellestiriyorum.
    const drawInteraction = new Draw({
      type: this.generalDataService._featureType, // Çizilebilecek şekil türünü (Point, LineString, Polygon) seciyorum
    });
    // that.map.removeInteraction(drawInteraction)
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

  // getList() {
  //     //  const modalDiv=document.getElementById("liste")
  //     //  if(modalDiv!=null){
  //     //    modalDiv.style.display="block"
  //     //  }
  //     },
  //     error:(err)=>{
  //       // const modalDiv=document.getElementById("liste")
  //       // if(modalDiv!=null){
  //       //   modalDiv.style.display="block"
  //       // }
  //     }
  //   });
    // this.geometryListModal.getData();



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
          console.log(`Dialog result: ${result}`);
        });
      },
      error:(err)=>{
        this.hideSpinner()
        //Yapılacak Baska İşlemler de var.
      }
    });

  }
}
export enum FeatureType {
  Circle = 'Circle',
  LineString = 'LineString',
  Point = 'Point',
  Polygon = 'Polygon',
}
