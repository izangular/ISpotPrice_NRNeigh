import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { IRentData } from './IRentData';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiService]
})
export class HomePage implements OnInit {
  private propertyTypes = [];
  private layers: string;
  //public rentData: IRentData;

  public latitude: number;
  public longitude: number;
  private year: number;
  private filter: string;
  private culture: string;
  private nbComparableProperties: number;
  private propertyType:number;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();

  constructor(private navCtrl: NavController, private viewCtrl: ViewController,
    private zone: NgZone, private apiService: ApiService) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  ngOnInit(){
    this.latitude = 0;
    this.longitude = 0;
    this.year = 2016;
    this.culture = 'en-US';
  }
 
  dismiss() {
    //this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    //this.viewCtrl.dismiss(item);
    this.autocompleteItems = [];
    this.autocomplete.query = item;
    
    var geocoder = new google.maps.Geocoder();
    this.geocodeAddress(geocoder, this.map);
  }

  geocodeAddress(geocoder, resultsMap) {
    var address = this.autocomplete.query;
    geocoder.geocode({ 'address': address }, function (results, status) {
      if (status === 'OK') {
        resultsMap.setCenter(results[0].geometry.location);
       

        this.latitude = Number(results[0].geometry.location.lat().toFixed(10));
        this.longitude = Number(results[0].geometry.location.lng().toFixed(10));
        localStorage.setItem("lat",this.latitude);
        localStorage.setItem("lon",this.longitude);

        console.log("Lat: " + this.latitude)
        console.log("Lon: " + this.longitude)

        var marker = new google.maps.Marker({
          map: resultsMap,
          position: results[0].geometry.location
        });

        var cityCircle = new google.maps.Circle({
          center: results[0].geometry.location,
          map: resultsMap,
          radius: 150,
          fillColor: 'green',
          fillOpacity: 0.3,
          strokeColor: 'black',
          strokeWeight: 1
        });

      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }
    });
  }


  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;

    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'CH' } }, function (predictions, status) {
      me.autocompleteItems = [];
      me.zone.run(function () {
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
      });
    });
  }

  ionViewDidLoad() {
    console.log('test');
    this.loadMap(new google.maps.LatLng(47.40799130707436, 8.555858796993675));
  }

  loadMap(latLng) {

    //let latLng = new google.maps.LatLng(47.40799130707436, 8.555858796993675);

    let mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }

  onLayerChange(layer) {
    console.log(this.layers);
    console.log("Lat: " + this.latitude)
    console.log("Lon: " + this.longitude)
    switch (this.layers) {
      case "0": this.propertyTypes = this.getPropertyTypes(); break;
      case "1": this.propertyTypes = this.getContractTypes(); break;
      default: this.propertyTypes = this.getPropertyTypes(); break;
    }

  }

  onComparablePropertyChange() {
    console.log(this.layers);
    console.log(this.nbComparableProperties)
    console.log(this.year)
    console.log(this.culture)
    console.log(this.propertyType)
    console.log(Number(localStorage.getItem("lat")))
    console.log(Number(localStorage.getItem("lon")))

    //Service Call Example//
    this.apiService.rentFinancials( Number(localStorage.getItem("lat")), Number(localStorage.getItem("lon")), this.year, this.culture, 
                                   "propertyType=" + "0", this.nbComparableProperties).
      subscribe(
      (data) => {
        console.log("RentFinancials " + data.rentalUnitFinancial.medianMarketValuePerSquareMeter);
      },
      (error) => {
        console.log(error);
      }
      )

    this.apiService.rentContracts( Number(localStorage.getItem("lat")), Number(localStorage.getItem("lon")), this.culture, 
                                   "objectType=" + "0", this.nbComparableProperties).
      subscribe(
      (data) => {
        console.log("RentContracts " + data.rentalUnitContract.medianNetRentPerSquareMeter);
      },
      (error) => {
        console.log(error);
      }
      )

  }

  getPropertyTypes() {
    let propertyTypes = [
      { label: 'All', value: 0 },
      { label: 'Residential properties', value: 1 },
      { label: 'Mixed properties', value: 2 },
      { label: 'Commercial properties', value: 3 }
    ];
    return propertyTypes;
  }

  getContractTypes() {
    let contractTypes = [
      { label: 'All', value: 0 },
      { label: 'Wohnen', value: 1 },
      { label: 'Gewerbe (Bsp. Zahnarzt, Massage, Friseur)', value: 2 },
      { label: 'Büro', value: 3 },
      { label: 'Verkauf', value: 4 },
      { label: 'Archiv', value: 5 },
      { label: 'Bastelraum', value: 6 },
      { label: 'Lager', value: 7 },
      { label: 'Hotel / Gastgewerbe', value: 8 },
      { label: 'Parking', value: 9 },
      { label: 'Benutzungsrecht', value: 10 },
      { label: 'Diverse', value: 11 },
      { label: 'Heilen und Pflegen', value: 12 },
      { label: 'Bildung, Unterricht und Kultur', value: 13 }
    ];
    return contractTypes;
  }

  getNs() {
    let ns = [
      { label: '5', value: 5 },
      { label: '7', value: 7 },
      { label: '10', value: 10 },
      { label: '15', value: 15 }
    ];
    return ns;
  }


}
