import { OnInit, Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../providers/api-service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@Component({
    selector: 'register',
    templateUrl: 'register.html',
    providers: [ApiService,UniqueDeviceID]
})

export class Register {

    registerform: FormGroup;
    submitAttempt: boolean = false;
    errorMessage: string;
    deviceId:string;

    constructor(private navCtrl: NavController, private formBuilder: FormBuilder, private apiService: ApiService,
        private uniqueDeviceID: UniqueDeviceID) {
        this.registerform = formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            phoneNumber: ['', Validators.required]
        });

        this.deviceId = "123%$78";
    }

    register() {
        this.submitAttempt = true;
        //  this.uniqueDeviceID.get()
        //                     .then((uuid: any) => this.deviceId = uuid )
        //                     .catch((error: any) => console.log(error));

        // console.log("deviceID: " + this.deviceId);

        if (!this.registerform.valid) {
            console.log("Invalid");
        }
        else {
            this.apiService.register(this.registerform.controls.firstName.value, this.registerform.controls.lastName.value, this.registerform.controls.email.value,
                this.registerform.controls.phoneNumber.value, this.deviceId).subscribe(
                (data) => {
                    if (data == "Success") {
                        console.log("success!");
                        localStorage.setItem("register","true");
                        console.log("RegisterTest: " + localStorage.getItem("register"));
                        this.navCtrl.push(HomePage);                      
                    }
                },
                (error) => {
                    console.log(error);
                    this.errorMessage = "Registration Failed";
                }
                )
            console.log(this.registerform.controls.firstName.value);
            console.log("success!");
            //this.navCtrl.push(HomePage);

        }




    }
}