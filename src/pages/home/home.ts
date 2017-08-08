import { Component, ViewChild, ElementRef, NgZone } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  autocompleteItems;
  autocomplete;
  service = new google.maps.places.AutocompleteService();

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, private zone: NgZone) {
    this.autocompleteItems = [];
    this.autocomplete = {
      query: ''
    };
  }

  dismiss() {
    //this.viewCtrl.dismiss();
  }

  chooseItem(item: any) {
    //this.viewCtrl.dismiss(item);
    this.autocompleteItems = [];
    this.autocomplete.query = item;

    var geocoder = new google.maps.Geocoder();
   this.geocodeAddress(geocoder,this.map);
  }

  geocodeAddress(geocoder, resultsMap) {
        var address = this.autocomplete.query;
        geocoder.geocode({'address': address}, function(results, status) {
          if (status === 'OK') {
            resultsMap.setCenter(results[0].geometry.location);
            
            var marker = new google.maps.Marker({
              map: resultsMap,
              position: results[0].geometry.location
            });

            var cityCircle = new google.maps.Circle({
            center: results[0].geometry.location,
            map: resultsMap,
            radius: 150,
            fillColor: 'green',
            fillOpacity: 0.5,
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

}
