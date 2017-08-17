import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { IRentData, IRentalUnitContract, IRentalUnitFinancial } from '../home/IRentData';

@Component({
    selector: 'resultpanel',
    templateUrl: 'resultpanel.html'
})

export class ResultPanel {
    rentalFinancials: IRentalUnitFinancial;
    rentalContracts: IRentalUnitContract;
    public Average: boolean;
    public Median: boolean;
    public Properties: boolean;
    public Contracts: boolean;
    public group:any;
    public address:any;

    constructor(private navCtrl: NavController, private navParams: NavParams) {

        this.Median = true;
        this.Average = false;
        this.rentalFinancials = this.navParams.get('rentalFinancials');
        this.rentalContracts = this.navParams.get('rentalContracts');
        this.address = this.navParams.get('address');
        this.group = "Median";

        if (this.rentalFinancials !== null) {
            this.Properties = true;
            this.Contracts = false;
        }
        else {
            this.Properties = false;
            this.Contracts = true;
        }

        console.log(this.navParams);
        console.log("RentalFinancial: " + this.rentalFinancials);
        console.log("RentalContracts: " + this.rentalContracts);
    }

    back() {
        this.navCtrl.pop();
    }

    median() {
        this.Median = true;
        this.Average = false;

    }

    average() {
        this.Average = true;
        this.Median = false;
    }
}