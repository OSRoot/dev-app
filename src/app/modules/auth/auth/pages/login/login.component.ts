import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HelpersService } from 'src/app/core/services/helper/helpers.service';
import { Login } from 'src/app/interfaces/user.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{

  login!:FormGroup;
  constructor(
    private helper:HelpersService,
    private fb:FormBuilder,
  ){}

  ngOnInit() {
    this.login = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  logMeIn() {
    const logins:Login = {
      email: this.login.value.email,
      password: this.login.value.password
    }
    this.helper.presentToast(`
    Email: ${logins.email}
    Password: ${logins.password}`, false)
  }

}
