import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email: string;
  password: string;

  constructor(private authService: AuthService, public router: Router, public toastController: ToastController) { }

  ngOnInit() {
  }
  /*
{"id":1, "correo":"admin@admin.com", "clave":1111, "perfil":"admin", "sexo":"femenino"}
{"id":2, "correo":"invitado@invitado.com", "clave":2222, "perfil":"invitado", "sexo":"femenino"}
{"id":3, "correo":"usuario@usuario.com", "clave":3333, "perfil":"usuario", "sexo":"masculino"}
{"id":4, "correo":"anonimo@anonimo.com", "clave":4444, "perfil":"usuario", "sexo":"masculino"}
{"id":5, "correo":"tester@tester.com", "clave":5555, "perfil":"tester","sexo": "femenino"} 
  */
  autocomplete(user: string){
    if (user == "admin") {
      this.email = "admin@admin.com";
      this.password = "111111";
    } else if (user == "invitado") {
      this.email = "invitado@invitado.com";
      this.password = "222222";
    } else if (user == "cristian") {
      this.email = "usuario@usuario.com";
      this.password = "333333";
    } else if (user == "aitu") {
      this.email = "anonimo@anonimo.com";
      this.password = "444444";
    } else if (user == "tester") {
      this.email = "tester@tester.com";
      this.password = "555555";
    } else {
      this.email = "";
      this.password = "";
    }
  }

  OnSubmitLogin() {
    this.authService.login(this.email, this.password).then(res => {
      this.router.navigate(['/home']);
    }).catch(err => {
      //alert('los datos son incorrectos o no existe el usuario');
      // Implementar toast
      this.presentToast()
    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'los datos son incorrectos o no existe el usuario',
      duration: 2000,
      color: "secondary"
    });
    toast.present();
  }
}
