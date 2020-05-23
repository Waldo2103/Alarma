import { Component, OnInit } from '@angular/core';


import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';

import { timer } from 'rxjs/internal/observable/timer';
import { ToastController } from '@ionic/angular';

import { NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  activate: string = "desactivado.png";
  cambiarFondo: string = "content";
  public message;
  public active;
  private spinner: any;
  private horizontal = true;
  private vertical = true;
  private derecha = true;
  private izquierda = true;
  private reproduciendoAudio = false;
  private analizarMovimiento: any;
  public accel: string;

  constructor(//private authService: AuthenticationService,
    private navCtrl: NavController,
    //private spinnerHand: SpinnerHandlerService,
    //public errorHand: ErrorHandlerService,
    public plt: Platform,

    private deviceMotion: DeviceMotion,
    public audio: NativeAudio,

    private flash: Flashlight,
    private vibrator: Vibration,
    public toastController: ToastController) { }

    audio1 = new Audio();
    audio2 = new Audio();
    audio3 = new Audio();
    audio4 = new Audio();

  ngOnInit() {
    this.active = false;
    this.horizontal = true;
    this.message = 'Activar Alarma';
    'assets/ '
    // Prepara los sonidos
    this.audio1.src = '../../assets/sounds/izquierda.mp3';
    this.audio2.src = '../../assets/sounds/derecha.mp3';
    this.audio3.src = '../../assets/sounds/horizontal.mp3';
    this.audio4.src = '../../assets/sounds/vertical.mp3';
    this.audio.preloadComplex('izquierda', '../..assets/sounds/izquierda.wav', 1.0, 1, 0).then(r => {
      // this.ReproducirAudio('izquierda');
    }).catch(e => { });
    this.audio.preloadComplex('derecha', '../..assets/sounds/derecha.wav', 1.0, 1, 0).then(r => {
      // this.ReproducirAudio('derecha');
    }).catch(e => { });
    this.audio.preloadComplex('horizontal', '../..assets/sounds/horizontal.wav', 1.0, 1, 0).then(r => {
      // this.ReproducirAudio('horizontal');
    }).catch(e => { });
    this.audio.preloadComplex('vertical', '../..assets/sounds/vertical.wav', 1.0, 1, 0).then(r => {
      // this.ReproducirAudio('vertical');
    }).catch(e => { });
  }

  async presentToast() {
    const toast = await this.toastController.create({
      message: 'Debe desactivar la alarma para cerrar sesión',
      duration: 2000,
      color: "danger"
    });
    toast.present();
  }
  Logout() {
    if (this.activate != "activado.png") {
      location.href = "/login";
    } else {
      this.presentToast();
    }

  }

  Activar() {
    if (this.activate == "desactivado.png") {
      this.activate = "activado.png";
      //this.ToActivarAlarma();
    } else if (this.activate = "activado.png") {
      this.activate = "desactivado.png";
    } else {
      alert("error");

    }
    if (this.cambiarFondo == "content") {
      this.cambiarFondo = "contentActivado";
      //console.log(this.cambiarFondo);
    } else if (this.cambiarFondo == "contentActivado") {
      this.cambiarFondo = "content";
    } else {
      alert("error");

    }
  }

  public ToActivarAlarma() {
    // Si tenía la alarma activada, la desactiva, deja de escuchar los cambios en el movimiento
    // y la orientación del dispositivo y frena todos los audios que haya en curso
    if (this.active) {
      this.active = false;
      this.message = 'Activar Alarma';
      this.Activar();
      this.analizarMovimiento.unsubscribe();
      this.PararSonidos();
    } else {
      // Si la alarma estaba desactivada, la activa
      this.active = true;
      this.message = 'Desactivar Alarma';
      this.Activar();

      this.analizarMovimiento = this.deviceMotion.watchAcceleration({ frequency: 50 })
        .subscribe((acceleration: DeviceMotionAccelerationData) => {
          this.accel = acceleration.x.toFixed(3) + ' - ' + acceleration.y.toFixed(3);

          if (acceleration.x > 8.0) {
            if (this.izquierda) {
              this.izquierda = false;
              //this.ReproducirAudioYo(this.audio1, 1);
              this.audio1.play();
              timer(1000).subscribe(() => { this.derecha = true; });
            }
          } else if (acceleration.x < -8.0) {
            if (this.derecha) {
              this.derecha = false;
              //this.ReproducirAudioYo(this.audio2, 1);
              this.audio2.play();
              timer(1000).subscribe(() => { this.izquierda = true; });
            }
          } else if (acceleration.x > -3.0 && acceleration.x < 3.0 && acceleration.y > 8.5) {
            if (this.vertical) {
              this.vibrator.vibrate(0);
              this.vertical = false;
              this.horizontal = false;
              //this.ReproducirAudioYo(this.audio4, 5);
              this.audio4.play();
              this.flash.switchOn();
              timer(5000).subscribe(() => { this.flash.switchOff(); this.vertical = true; });
            }
          } else if (acceleration.x > -3.0 && acceleration.x < 3.0 && acceleration.y < 1.0 && acceleration.y > -1) {
            if (!this.horizontal) {
              if (this.flash.isSwitchedOn()) {
                this.flash.switchOn();
              }
              this.horizontal = true;
              //this.ReproducirAudioYo(this.audio3, 5);
              this.audio3.play();
              this.vibrator.vibrate(5000);
            }
          }
        });
    }
  }

  public ReproducirAudioYo(audio: HTMLAudioElement, delay: number) {
    this.PararSonidos();
    audio.play();

    if (!this.reproduciendoAudio) {

    } else {
      this.reproduciendoAudio = true;
      timer(1000 * delay).subscribe(() => {
        this.reproduciendoAudio = false;
      });
    }
  }

  public ReproducirAudio(sonido: string, delay: number) {
    this.PararSonidos();
    this.audio.play(sonido);

    if (!this.reproduciendoAudio) {

    } else {
      this.reproduciendoAudio = true;
      timer(1000 * delay).subscribe(() => {
        this.reproduciendoAudio = false;
      });
    }
  }

  public PararSonidos() {
    this.audio.stop('izquierda');
    this.audio.stop('derecha');
    this.audio.stop('vertical');
    this.audio.stop('horizontal');
    this.audio1.pause();
    this.audio2.pause();
    this.audio3.pause();
    this.audio4.pause();
  }

}
/*
import { Component, OnInit } from '@angular/core';
//import { AuthenticationService } from 'src/app/services/authentication.service';
import { NavController, Platform } from '@ionic/angular';
//import { SpinnerHandlerService } from 'src/app/services/spinner-handler.service';
//import { ErrorHandlerService } from 'src/app/services/error-handler.service';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Flashlight } from '@ionic-native/flashlight/ngx';
import { Vibration } from '@ionic-native/vibration/ngx';
import { timer } from 'rxjs/internal/observable/timer';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  public message;
  public active;
  private spinner: any;
  private horizontal = true;
  private vertical = true;
  private derecha = true;
  private izquierda = true;
  private reproduciendoAudio = false;
  private analizarMovimiento: any;
  public accel: string;

  constructor(
    //private authService: AuthenticationService,
    private navCtrl: NavController,
    //private spinnerHand: SpinnerHandlerService,
    //public errorHand: ErrorHandlerService,
    public plt: Platform,

    private deviceMotion: DeviceMotion,
    private audio: NativeAudio,
    private flash: Flashlight,
    private vibrator: Vibration
  ) { }

  public async LogOut() {
    //this.spinner = await this.spinnerHand.GetAllPageSpinner('Cerrando.');
    //this.spinner.present();

    if (this.active) {
      this.ToActivarAlarma();
    }

    /*this.authService.LogOut().then(() => {
      this.navCtrl.navigateRoot('login', { replaceUrl: true });
    }).catch(error => {
      this.errorHand.MostrarError(error);
    }).finally(() => {
      this.spinner.dismiss();
    });*
  }

  ngOnInit() {
    this.active = false;
    this.horizontal = true;
    this.message = 'Activar Alarma';

    // Prepara los sonidos
    this.audio.preloadComplex('izquierda', 'assets/sounds/izquierda.wav', 1.0, 1, 0).then(r => {
      // this.ReproducirAudio('izquierda');
    }).catch(e => { });
    this.audio.preloadComplex('derecha', 'assets/sounds/derecha.wav', 1.0, 1, 0).then(r => {
      // this.ReproducirAudio('derecha');
    }).catch(e => { });
    this.audio.preloadComplex('horizontal', 'assets/sounds/horizontal.wav', 1.0, 1, 0).then(r => {
      // this.ReproducirAudio('horizontal');
    }).catch(e => { });
    this.audio.preloadComplex('vertical', 'assets/sounds/vertical.wav', 1.0, 1, 0).then(r => {
      // this.ReproducirAudio('vertical');
    }).catch(e => { });
  }

  public ToActivarAlarma() {
    // Si tenía la alarma activada, la desactiva, deja de escuchar los cambios en el movimiento
    // y la orientación del dispositivo y frena todos los audios que haya en curso
    if (this.active) {
      this.active = false;
      this.message = 'Activar Alarma';
      this.analizarMovimiento.unsubscribe();
      this.PararSonidos();
    } else {
      // Si la alarma estaba desactivada, la activa
      this.active = true;
      this.message = 'Desactivar Alarma';

      this.analizarMovimiento = this.deviceMotion.watchAcceleration({ frequency: 50 })
        .subscribe((acceleration: DeviceMotionAccelerationData) => {
          this.accel = acceleration.x.toFixed(3) + ' - ' + acceleration.y.toFixed(3);
          
          if (acceleration.x > 8.0) {
            if (this.izquierda) {
              this.izquierda = false;
              this.ReproducirAudio('izquierda', 1);
              timer(1000).subscribe(() => { this.derecha = true; });
            }
          } else if (acceleration.x < -8.0) {
            if (this.derecha) {
              this.derecha = false;
              this.ReproducirAudio('derecha', 1);
              timer(1000).subscribe(() => { this.izquierda = true; });
            }
          } else if (acceleration.x > -3.0 && acceleration.x < 3.0 && acceleration.y > 8.5) {
            if (this.vertical) {
              this.vibrator.vibrate(0);
              this.vertical = false;
              this.horizontal = false;
              this.ReproducirAudio('vertical', 5);
              this.flash.switchOn();
              timer(5000).subscribe(() => { this.flash.switchOff(); this.vertical = true; });
            }
          } else if (acceleration.x > -3.0 && acceleration.x < 3.0 && acceleration.y < 1.0 && acceleration.y > -1) {
            if (!this.horizontal) {
              if (this.flash.isSwitchedOn()) {
                this.flash.switchOn();
              }
              this.horizontal = true;
              this.ReproducirAudio('horizontal', 5);
              this.vibrator.vibrate(5000);
            }
          }
        });
    }
  }

  public ReproducirAudio(sonido: string, delay: number) {
    this.PararSonidos();
    this.audio.play(sonido);

    if (!this.reproduciendoAudio) {

    } else {
      this.reproduciendoAudio = true;
      timer(1000 * delay).subscribe(() => {
        this.reproduciendoAudio = false;
      });
    }
  }

  public PararSonidos() {
    this.audio.stop('izquierda');
    this.audio.stop('derecha');
    this.audio.stop('vertical');
    this.audio.stop('horizontal');
  }
}
*/