import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import { NavController, ViewController, LoadingController,Events } from 'ionic-angular';
import { ApiService } from '../../providers/api-service';
import { IRentData, IRentalUnitContract, IRentalUnitFinancial } from './IRentData';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [ApiService]
})
export class HomePage implements OnInit {

  private propertyTypes = [];
  private layers: string;

  public latitude: number = 0;
  public longitude: number = 0;
  private year: number;
  private filter: string;
  private culture: string;
  private nbComparableProperties: number;
  private propertyType: any;

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  autocompleteItems;
  autocomplete;
  location;
  service = new google.maps.places.AutocompleteService();
  rentalFinancials: IRentalUnitFinancial;
  rentalContracts: IRentalUnitContract;

  public Average: boolean;
  public Median: boolean;
  public Properties: boolean;
  public Contracts: boolean;
  public activebutton: number;
  //show:any;

  constructor(private navCtrl: NavController, private viewCtrl: ViewController,
    private zone: NgZone, private apiService: ApiService, private loadingCtrl:LoadingController,private events:Events) {

    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };

    this.propertyType = {
      value: ''
    };

    this.Average = true;
    this.Median = false;
    this.Properties = true;
    this.Contracts = false;   
  }

  ngOnInit() {
     localStorage.clear();
    this.initialiseVariables();

  }

  initialiseVariables() {
    this.layers = "0";
    this.onLayerChange(this.layers);
    this.nbComparableProperties = 5;
    this.propertyType.value = 0;
    this.year = 2016;
    this.culture = 'en-US';

    this.rentalFinancials = {
      maximalDistance: null,
      medianMarketValuePerSquareMeter: null,
      medianExpectedRentPerSquareMeter: null,
      medianExpectedRentPerMarketValue: null,
      medianOtherIncomePerSquareMeter: null,
      medianOperatingExpensesPerNetRent: null,
      medianMaintenanceAndInvestmentsPerNetRent: null,
      medianUnrealizedRentPerNetRent: null,
      medianNcfPerSquareMeter: null,
      medianNcfPerMarketValue: null,
      medianValueChangePerMarketValue: null,
      medianPerformancePerMarketValue: null,
      medianTotalExpensesPerNetRent: null,

      meanMarketValuePerSquareMeter: null,
      meanExpectedRentPerSquareMeter: null,
      meanExpectedRentPerMarketValue: null,
      meanOtherIncomePerSquareMeter: null,
      meanOperatingExpensesPerNetRent: null,
      meanMaintenanceAndInvestmentsPerNetRent: null,
      meanUnrealizedRentPerNetRent: null,
      meanNcfPerSquareMeter: null,
      meanNcfPerMarketValue: null,
      meanValueChangePerMarketValue: null,
      meanPerformancePerMarketValue: null,
      meanTotalExpensesPerNetRent: null,
    };

    this.rentalContracts = {
      maximalDistance: null,
      medianNetRentPerSquareMeter: null
    };


  }

  dismiss() {
    //this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    //this.viewCtrl.dismiss(item);
    this.autocompleteItems = [];
    this.autocomplete.query = item;

    this.loadMap();

  }


  loadMap() {
    var geocoder = new google.maps.Geocoder();
    var address = this.autocomplete.query;
    var resultsMap = this.map;
    
    geocoder.geocode({ 'address': address }, (results, status) => {
      if (status === 'OK') {
       
        resultsMap.setCenter(results[0].geometry.location);

        //set lat lon in local storage//
        localStorage.setItem("lat", results[0].geometry.location.lat().toFixed(10));
        localStorage.setItem("lon", results[0].geometry.location.lng().toFixed(10));
        
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

        this.serviceCall();
        
      } else {
        alert('Geocode was not successful for the following reason: ' + status);
      }

       
    });

   
  }

private test(){
  console.log("test");
}
  updateSearch() {
    if (this.autocomplete.query == '') {
      this.autocompleteItems = [];
      return;
    }
    let me = this;

    this.service.getPlacePredictions({ input: this.autocomplete.query, componentRestrictions: { country: 'CH' } }, function (predictions, status) {
      me.autocompleteItems = [];
      if(predictions != null) {
      me.zone.run(function () {
        predictions.forEach(function (prediction) {
          me.autocompleteItems.push(prediction.description);
        });
      });
      }
    });
  }

  ionViewDidLoad() {
    console.log('test');
    this.initMap(new google.maps.LatLng(47.40799130707436, 8.555858796993675));
  }

  initMap(latLng) {
    let mapOptions = {
      center: latLng,
      zoom: 17,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }

   this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

  }

  onLayerChange(layer) {
    localStorage.setItem("layer", layer);
    switch (this.layers) {
      case "0": this.propertyTypes = this.getPropertyTypes(); this.Properties = true; this.Contracts = false; break;
      case "1": this.propertyTypes = this.getContractTypes(); this.Contracts = true; this.Properties = false; break;
      default: this.propertyTypes = this.getPropertyTypes(); break;
    }

    this.serviceCall();
  }

  propertyTypeChange(){
    console.log("PropertyType");
    this.serviceCall();
  }

  median() {
    console.log("median");
    this.Median = true;
    this.Average = false;

  }

  average() {
    console.log("average");
    this.Average = true;
    this.Median = false;
  }

  onComparablePropertyChange() {

    localStorage.setItem("onComparableProperty", String(this.nbComparableProperties))

    this.serviceCall();

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

 serviceCall() {

    console.log("layers: " + this.layers);

    if (localStorage.getItem("lat") !== null && localStorage.getItem("lon") !== null) {
      if (this.layers == "0")
        this.callRentFinancials();
      else
        this.callRentContracts();
    }
  }

  callRentFinancials() {
      let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Estimation in Progress...'
      }); 
      loading.present();

    this.apiService.rentFinancials(Number(localStorage.getItem("lat")), Number(localStorage.getItem("lon")), this.year, this.culture,
      "propertyType=" + this.propertyType.value, this.nbComparableProperties).
      subscribe(
      (data) => {
        console.log(data);

        this.rentalFinancials.maximalDistance = data.rentalUnitFinancial.maximalDistance;

        this.rentalFinancials.medianMarketValuePerSquareMeter = data.rentalUnitFinancial.medianMarketValuePerSquareMeter;
        this.rentalFinancials.medianExpectedRentPerSquareMeter = data.rentalUnitFinancial.medianExpectedRentPerSquareMeter;
        this.rentalFinancials.medianExpectedRentPerMarketValue = data.rentalUnitFinancial.medianExpectedRentPerMarketValue;
        this.rentalFinancials.medianOtherIncomePerSquareMeter = data.rentalUnitFinancial.medianOtherIncomePerSquareMeter;
        this.rentalFinancials.medianOperatingExpensesPerNetRent = data.rentalUnitFinancial.medianOperatingExpensesPerNetRent;
        this.rentalFinancials.medianMaintenanceAndInvestmentsPerNetRent = data.rentalUnitFinancial.medianMaintenanceAndInvestmentsPerNetRent;
        this.rentalFinancials.medianUnrealizedRentPerNetRent = data.rentalUnitFinancial.medianUnrealizedRentPerNetRent;
        this.rentalFinancials.medianNcfPerSquareMeter = data.rentalUnitFinancial.medianNcfPerSquareMeter;
        this.rentalFinancials.medianNcfPerMarketValue = data.rentalUnitFinancial.medianNcfPerMarketValue;
        this.rentalFinancials.medianValueChangePerMarketValue = data.rentalUnitFinancial.medianValueChangePerMarketValue;
        this.rentalFinancials.medianPerformancePerMarketValue = data.rentalUnitFinancial.medianPerformancePerMarketValue;
        this.rentalFinancials.medianTotalExpensesPerNetRent = data.rentalUnitFinancial.medianTotalExpensesPerNetRent;

        this.rentalFinancials.meanMarketValuePerSquareMeter = data.rentalUnitFinancial.meanMarketValuePerSquareMeter;
        this.rentalFinancials.meanExpectedRentPerSquareMeter = data.rentalUnitFinancial.meanExpectedRentPerSquareMeter;
        this.rentalFinancials.meanExpectedRentPerMarketValue = data.rentalUnitFinancial.meanExpectedRentPerMarketValue;
        this.rentalFinancials.meanOtherIncomePerSquareMeter = data.rentalUnitFinancial.meanOtherIncomePerSquareMeter;
        this.rentalFinancials.meanOperatingExpensesPerNetRent = data.rentalUnitFinancial.meanOperatingExpensesPerNetRent;
        this.rentalFinancials.meanMaintenanceAndInvestmentsPerNetRent = data.rentalUnitFinancial.meanMaintenanceAndInvestmentsPerNetRent;
        this.rentalFinancials.meanUnrealizedRentPerNetRent = data.rentalUnitFinancial.meanUnrealizedRentPerNetRent;
        this.rentalFinancials.meanNcfPerSquareMeter = data.rentalUnitFinancial.meanNcfPerSquareMeter;
        this.rentalFinancials.meanNcfPerMarketValue = data.rentalUnitFinancial.meanNcfPerMarketValue;
        this.rentalFinancials.meanValueChangePerMarketValue = data.rentalUnitFinancial.meanValueChangePerMarketValue;
        this.rentalFinancials.meanPerformancePerMarketValue = data.rentalUnitFinancial.meanPerformancePerMarketValue;
        this.rentalFinancials.meanTotalExpensesPerNetRent = data.rentalUnitFinancial.meanTotalExpensesPerNetRent;

        this.Properties = true;
        this.Contracts = false;

      },
      (error) => {
        console.log(error);
      },
      ()=>{
                 loading.dismiss();
          }
      )
  }

  callRentContracts() {
     let loading = this.loadingCtrl.create({
        spinner: 'bubbles',
        content: 'Estimation in Progress...'
      }); 
      loading.present();
      
    this.apiService.rentContracts(Number(localStorage.getItem("lat")), Number(localStorage.getItem("lon")), this.culture,
      "objectType=" + this.propertyType.value, this.nbComparableProperties).
      subscribe(
      (data) => {
        console.log(data.maximalDistance);
        console.log(data.medianNetRentPerSquareMeter);
        this.rentalContracts.maximalDistance = data.rentalUnitContract.maximalDistance;
        this.rentalContracts.medianNetRentPerSquareMeter = data.rentalUnitContract.medianNetRentPerSquareMeter;

        this.Contracts = true;
        this.Properties = false;

      },
      (error) => {
        console.log(error);
      },
      ()=>{
                 loading.dismiss();
          }    
      )
  }

}
