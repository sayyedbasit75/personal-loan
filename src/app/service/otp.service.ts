import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PersonalLoan } from '../interface/personalLoan';
import { verfiyOtp } from '../interface/verifyOtp';

@Injectable({
  providedIn: 'root'
})
export class OtpService {

  constructor(private http: HttpClient) { }

  sendOTP(data: PersonalLoan): Observable<any> {
    console.log('send otp', data)
    return this.http.post<any>("http://lab.thinkoverit.com/api/getOTP.php", data)
  }

  verfiyOtp(data: verfiyOtp): Observable<any> {
    console.log('verify data', data)
    return this.http.post<any>("http://lab.thinkoverit.com/api/verifyOTP.php", data)
  }
}
