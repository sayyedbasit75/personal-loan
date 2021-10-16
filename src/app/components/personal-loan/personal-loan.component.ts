import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { sendOtpResponse } from 'src/app/interface/sendOtpResponse';
import { verifyOtpResponse } from 'src/app/interface/verifyOtpResponse';
import { OtpService } from 'src/app/service/otp.service';

@Component({
  selector: 'app-personal-loan',
  templateUrl: './personal-loan.component.html',
  styleUrls: ['./personal-loan.component.css']
})
export class PersonalLoanComponent implements OnInit {

  form!: FormGroup

  isOtpReceived: boolean = false //OTP Flag
  otpResendButton: boolean = true //Resend OTP Flag
  resendOtpErrMsg: boolean = false //Resend OTP Error Message Flag
  hideResendButton: boolean = true // Hide Resend Button Flag
  isRegistration: boolean = true // Form Flag

  resendOtpCount: number = 0 // OTP Count - how many time resend button clicked
  fullName: string = '' // property used to dispay name on Thank you screen


  constructor(
    private fb: FormBuilder,
    private otpService: OtpService
  ) { }

  ngOnInit(): void {

    // initialize form controls
    this.form = this.fb.group({
      city: ['', [Validators.required]],
      panNumber: ['', [Validators.required, Validators.pattern("^([a-zA-Z]){5}([0-9]){4}([a-zA-Z]){1}?$")]],
      fullName: ['', [Validators.required, Validators.maxLength(140)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      mobile: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10), Validators.pattern('[0-9]*')]],
      otp: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(4), Validators.pattern('[0-9]*')]],
    })
  }

  // getter for easy access to form fields
  get f() { return this.form.controls }


  // Send OTP 
  sendOtp() {
    let mobileNumber = this.form.controls.mobile.value

    if (this.form.controls.mobile.valid) {
      // if mobile number is valid then send OTP
      if (mobileNumber.length == 10) {
        let data = this.form.value
        this.otpService.sendOTP(data).subscribe((res: sendOtpResponse) => {
          if (res.statusCode == 200) {
            this.isOtpReceived = true // show OTP Fields
            this.otpResendButton = true // Show OTP Resend Btton
            this.updateResendButton() // Enable OTP Button after 3 Minutes
          } else console.log("Some Thing Failed", res)
        })
      } else {
        this.isOtpReceived = false // Hide OTP Field
      }

    } else this.isOtpReceived = false  // Hide OTP Field
  }



  // Resend OTP 
  resendOtp() {
    if (this.resendOtpCount < 3) {
      // if  OTP Count Less than 3 then resend OTP 
      this.resendOtpCount += 1 // Increase resend count with plus 1
      this.otpResendButton = true // disable OTP Button
      this.updateResendButton() // Enable OTP Button After 3 Minutes
    } else {
      this.resendOtpErrMsg = true // show OTP error message
      this.hideResendButton = false // hide resend button 
    }
  }


  //Enable resend flag after 3 minutes
  updateResendButton() {
    setTimeout(() => {
      this.otpResendButton = false
    }, 180000)
    // 180000 3 min
  }


  //Check Entered OTP is correct or not
  checkOTP() {
    if (this.form.controls.otp.valid) {
      // if otp is valid then check with api call
      let { mobile, otp } = this.form.value
      this.otpService.verfiyOtp({ mobile, otp }).subscribe((res: verifyOtpResponse) => {
        if (res.statusCode == 200) {
          this.fullName = this.form.controls.fullName.value //if OTP is correct then show full on thank you screen
          this.isRegistration = false // hide apply form screen and show thank you screen
        } else console.log('err', res)
      })
    }
  }

}
