import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  constructor(private loadingCtrl: LoadingController) { }

  public async GetAllPageSpinner(messageSpinner) {
    const loader = await this.loadingCtrl.create({
      spinner: 'circles',
      keyboardClose: true,
      message: messageSpinner !== '' ? messageSpinner : undefined,
      showBackdrop: false
    });

    return loader;
  }
}
