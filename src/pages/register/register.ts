import { OnInit, Component } from '@angular/core';
import { NavController, LoadingController, } from 'ionic-angular';
import { HomePage } from '../../pages/home/home';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { ApiService } from '../../providers/api-service';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';

@Component({
    selector: 'register',
    templateUrl: 'register.html',
    providers: [ApiService, UniqueDeviceID]
})

export class Register {

    registerform: FormGroup;
    submitAttempt: boolean = false;
    errorMessage: string;
    deviceId: string;

    constructor(private navCtrl: NavController, private formBuilder: FormBuilder, private apiService: ApiService,
        private uniqueDeviceID: UniqueDeviceID, private loadingCtrl: LoadingController) {
        this.registerform = formBuilder.group({
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
            email: ['', Validators.required],
            phoneNumber: ['', Validators.required]
        });

        this.deviceId = "123%$78";
    }

    register() {

        //  this.uniqueDeviceID.get()
        //                     .then((uuid: any) => this.deviceId = uuid )
        //                     .catch((error: any) => console.log(error));

        // console.log("deviceID: " + this.deviceId);


        try {
            this.submitAttempt = true;
            if (!this.registerform.valid) {
                console.log("Invalid");
                //loading.dismiss();
            }
            else {

                let loading = this.loadingCtrl.create({
                    spinner: 'bubbles',
                    content: 'Please wait...'
                });

                loading.present();
                this.apiService.register(this.registerform.controls.firstName.value, this.registerform.controls.lastName.value, this.registerform.controls.email.value,
                    this.registerform.controls.phoneNumber.value, this.deviceId).subscribe(
                    (data) => {
                        if (data == "Success") {
                            console.log("success!");
                            localStorage.setItem("register", "true");
                            console.log("RegisterTest: " + localStorage.getItem("register"));
                            setTimeout(() => {
                                loading.dismiss();
                                this.navCtrl.push(HomePage);
                            }, 3000)

                        }
                        else {
                            loading.dismiss();
                        }
                    },
                    (error) => {
                        console.log(error);
                        loading.dismiss(); 
                        this.errorMessage = "Registration Failed";
                    }
                    )
                console.log(this.registerform.controls.firstName.value);
                console.log("success!");
                //this.navCtrl.push(HomePage);
            }
        }
        catch (e) {
            //loading.dismiss();
        }
        finally {
            //loading.dismiss();
        }

    }
}