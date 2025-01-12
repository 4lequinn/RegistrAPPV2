import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-estado-asistencia',
  templateUrl: './estado-asistencia.page.html',
  styleUrls: ['./estado-asistencia.page.scss'],
})
export class EstadoAsistenciaPage implements OnInit {
  rut:any;
  claseID:any;
  estado : any;
  constructor
  (
    private apiService : ApiService,
    private authentication : AuthenticationService,
    private alertController: AlertController,
    private loadingController: LoadingController
  )
  { }

  ngOnInit() {}

  ionViewDidEnter() {
    this.buscarEstadoAsistencia();
  };

  obtenerData(){
    if(localStorage.getItem('dataAlumno')){
      var data = JSON.parse(localStorage.getItem('dataAlumno'))
      this.rut = data.rut;
      this.claseID = data.claseID;
    }else{
      console.log('No hay datos en el local storage');
    }
  }

  async buscarEstadoAsistencia(){

    const carga = await this.loadingController.create({
      message: "Cargando estado ..."
    });

    await carga.present();

    this.obtenerData();
      this.apiService.buscarEstadoAsistenciaGET(this.rut,this.claseID).subscribe(
        (data) => {
          console.log(data);
          carga.dismiss();
          this.estado = data.estado; 
        },
        (error) => {
          console.log(error);
          carga.dismiss();
        }
      );
  }
  
  async cerrarSesion() {
    const alert = await this.alertController.create({
      header: "Cerrar sesión",
      message: "¿Estás seguro?",
      buttons: [
        {
          text: 'Sí',
          handler: () => {
            console.log("Sesión finalizada");
            this.authentication.logout();
          }
        },
        {
          text: 'No',
          handler: () => {
            console.log("Cancelar");
          }
        }
      ]
    });
    await alert.present();
    //Que se cierre cuando aprete el botón
    await alert.onDidDismiss();
  }

}
