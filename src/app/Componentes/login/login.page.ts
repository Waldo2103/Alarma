import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';/**OnDestroy y After son para cerrar la app */
import { AuthService } from '../../servicios/auth.service';
import { Router } from '@angular/router';

import { ToastController } from '@ionic/angular';

//Para Salir
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy, AfterViewInit {

  show = false;
  email: string;
  password: string;
//Para cerrar la app
  backButtonSubscription;
  constructor(private platform: Platform, private authService: AuthService, public router: Router, public toastController: ToastController) { }

  ngOnInit() {
  }
  //Para cerrar la app estas 2
  ngAfterViewInit() { 
    this.backButtonSubscription = this.platform.backButton.subscribe(()=> {
      navigator['app'].exitApp();
    });
  }
  ngOnDestroy() {
    this.backButtonSubscription.unsubscribe();
  }

  Salir(){
    this.backButtonSubscription = this.platform.backButton.subscribe(()=> {
      navigator['app'].exitApp();
    });
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
    this.show = true;
    this.authService.login(this.email, this.password).then(res => {
      this.show =false;
      this.router.navigate(['/home']);
    }).catch(err => {
      //alert('los datos son incorrectos o no existe el usuario');
      // Implementar toast
      this.show = false;
      this.presentToast()
    })
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'los datos son incorrectos o no existe el usuario',
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }
}
