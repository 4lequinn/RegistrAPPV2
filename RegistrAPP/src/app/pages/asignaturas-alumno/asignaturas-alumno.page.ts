import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
import { AsignaturaI } from 'src/app/components/model/asignatura.interface';
import { ApiService } from 'src/app/services/api.service';
import { AuthenticationService } from 'src/app/services/authentication.service';

@Component({
  selector: 'app-asignaturas-alumno',
  templateUrl: './asignaturas-alumno.page.html',
  styleUrls: ['./asignaturas-alumno.page.scss'],
})
export class AsignaturasAlumnoPage implements OnInit {


  //Recibimos el rut por URL
  rut : any;

  // Creamos un objeto de tipo asignatura
  asignatura : AsignaturaI;
  // Creamos una lista de asignaturas
  asignaturas : AsignaturaI[] = [];

  constructor
  (
    private activatedRoute: ActivatedRoute, // Para recibir los parametros
    private apiService: ApiService,
    private loadingController: LoadingController,
    private router:Router,
    private authentication: AuthenticationService,
    private alertController: AlertController
  )
   { }

  ngOnInit() {
    this.rut = this.activatedRoute.snapshot.paramMap.get("rut");
    this.listarAsignatura();
  }



  async listarAsignatura(){
    const carga = await this.loadingController.create({
      message:"Cargando ..."
    });

    await carga.present();

      this.apiService.listarAsignaturaAlumnoGET(this.rut).subscribe(
        (data) => {
          console.log(data);
          if(data.mensaje == 'Encontrado'){
            for(var i = 0; i<data.asignaturas.length; i++){

              // Creo un objeto de tipo Asignatura
              this.asignatura = {
                id:data.asignaturas[i][0],
                nombre:data.asignaturas[i][1],
                cursoID: null
              }
              // Lo agrego  a mi Array de ASIGNATURAS
              this.asignaturas.push(this.asignatura);
            }
            carga.dismiss();
          }else{
            // No encontró resultados Mensaje
            carga.dismiss();
          }
        }, 
        (error) => {
          console.log(error);
          carga.dismiss();
          // Mensaje de error se cayó el server
        } 
      );
  }

  listarClases(asignaturaID){
    this.router.navigate(['clases-alumno/',this.rut,asignaturaID]);
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

  cerrarSesion2(){
    this.authentication.logout();
  }

}
