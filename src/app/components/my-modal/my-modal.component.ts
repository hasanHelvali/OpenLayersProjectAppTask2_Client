import { Component, ElementRef, Injectable, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/common/base/base.component';
import { GeoLocation, IGeoLocation } from 'src/app/models/geo-location';
import { LocAndUsers } from 'src/app/models/locAndUsers';
import { LocationAndUsers } from 'src/app/models/location-and-users';
import { CustomHttpClient } from 'src/app/services/customHttpClient.service';
import { GeneralDataService } from 'src/app/services/general-data.service';
import { LocDataService } from 'src/app/services/loc-data.service';

declare var $:any;
@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-my-modal',
  templateUrl: './my-modal.component.html',
  styleUrls: ['./my-modal.component.css']
})

export class MyModalComponent extends BaseComponent implements OnInit {
  @ViewChild('myModal') myModal: ElementRef;

  data:GeoLocation
  data2:LocAndUsers;
  wkt:string;
  locationAndUser:LocationAndUsers=new LocationAndUsers();
  locAndUsers:LocAndUsers=new LocAndUsers();

  coordinatesAndType:IGeoLocation;
  constructor(private locDataService:LocDataService,private httpClient:CustomHttpClient,spinner:NgxSpinnerService,public generalDataService:GeneralDataService) {
    super(spinner)
   }
  ngOnInit(): void {
    console.log("---------------");
    // this.data=this.locDataService.data;
    this.data=this.generalDataService.location;
    this.wkt=this.generalDataService._wkt;
    if(this.generalDataService.location){
      console.log("--------------------");
      this.openModal();
    }
  }
  openModal() {
    const modelDiv=document.getElementById("myModal")
    if(modelDiv!=null){
      modelDiv.style.display="block"
    }
  }
  closeModal() {
    const modelDiv=document.getElementById("myModal")
    if(modelDiv!=null)
      modelDiv.style.display="none"
      this.generalDataService.location=null;
      this.locDataService.data2=null;
    }

    save(name:string){
      this.showSpinner();
      this.locationAndUser.coordinates=this.data.coordinates
      // console.log(this.data.coordinates);
      this.locationAndUser.type=this.generalDataService.location.type
      this.locationAndUser.name=name
      // console.log({name:this.locAndUser.name,coordinates:this.locAndUser.coordinates,type:this.locAndUser.type});
      // console.log(this.locationAndUser);

      this.locAndUsers.name=name;
      this.locAndUsers.wkt=this.generalDataService._wkt;

      console.log(this.locAndUsers);
      


      // this.httpClient.post<LocationAndUsers>({controller:"maps"},this.locationAndUser).subscribe({
      // this.httpClient.post<LocationAndUsers>({controller:"maps"},{Name:this.locationAndUser.Name,Type:this.locationAndUser.Type,Coordinates:this.locationAndUser.Coordinates}).subscribe({
    this.httpClient.post<LocAndUsers>({controller:"maps"},this.locAndUsers).subscribe({
      next:(data)=>{
        this.hideSpinner()
        alert("Veri Kaydedilmiştir.");
        this.closeModal();
      }, 
      error:(err)=>{
        this.hideSpinner();
        alert("Veri Eklenirken bir hata oluştu");
      }
    })
    // this.httpClient.get<any>({controller:"maps"}).subscribe({
    //   next:(data)=>{
    //     this.hideSpinner()
    //   },
    //   error:(err)=>{
    //     this.hideSpinner();
    //   }
    // })
    }
}
