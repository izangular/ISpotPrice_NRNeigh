import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {

    constructor(private http: Http) { }

    public register(firstname:string, lastname:string, email:string, phone:string, deviceid:string){
        let headers = new Headers();

        let body = {
            firstname: firstname,
            lastname: lastname,
            email: email,
            phone: phone,
            deviceid: deviceid
        };

        headers.append('Content-Type', 'application/json');

        return this.http.post("https://intservices.iazi.ch/api/apps/v1/register", JSON.stringify(body),
            { headers: headers })
            .map((res) => res.json());
    }


    public rentFinancials(latitude: number, longitude: number, year: number, culture: string, filter: string, nbComparableProperties: number) {
        let headers = new Headers();

        let body = {
            latitude: latitude,
            longitude: longitude,
            year: year,
            culture: culture,
            filter: filter,
            nbComparableProperties: nbComparableProperties,
            deviceId : "1234$%"
        };

        headers.append('Content-Type', 'application/json');

        return this.http.post("https://intservices.iazi.ch/api/apps/v1/nearestNeighbour/rentFinancials", JSON.stringify(body),
            { headers: headers })
            .map((res) => res.json());
    }

        public rentContracts(latitude: number, longitude: number, culture: string, filter: string, nbComparableProperties: number) {
        let headers = new Headers();

        let body = {
            latitude: latitude,
            longitude: longitude,
            culture: culture,
            filter: filter,
            nbComparableProperties: nbComparableProperties,
            deviceId : "1234$%"
        };

        headers.append('Content-Type', 'application/json');

        return this.http.post("https://intservices.iazi.ch/api/apps/v1/nearestNeighbour/rentContracts", JSON.stringify(body),
            { headers: headers })
            .map((res) => res.json());
    }

}