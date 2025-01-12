// Importamos el componente OnInit
import { Component, OnInit } from '@angular/core';

//Importamos el componente de manejo de forms
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

// Importamos el componente NavController
import { LoadingController, NavController } from '@ionic/angular';

//Importamos el componente de Routers
import { Router } from '@angular/router';

// Import Toast
import { ToastController } from '@ionic/angular';

//Importamos el Alert 
import { AlertController } from '@ionic/angular';

//Importamos AuthenticationService
import { AuthenticationService } from 'src/app/services/authentication.service';

// Importamos el API SERVICE
import { ApiService } from 'src/app/services/api.service';

// Importamos el Modelo de Usuario
import { UsuarioLoginI } from 'src/app/components/model/usuario.intefaces';


@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.page.html',
  styleUrls: ['./iniciar-sesion.page.scss'],
})

export class IniciarSesionPage implements OnInit {

  // Creamos atributos de clase
  //nombreUsuario:String;
  //contrasenia:String;

  // Creamos un FormGroup
  loginForm: FormGroup;

  // Creamos una plantilla de Usuario
  usuario: UsuarioLoginI;

  // Inicializamos el contructor con un router y un navControl
  constructor(
    private router: Router,
    private navControl: NavController,
    private formBuilder: FormBuilder,
    public toastController: ToastController,
    public alertController: AlertController,
    private authService: AuthenticationService,
    private apiService: ApiService,
    private loadingController: LoadingController
  ) {
    this.loginForm = this.formBuilder.group({
      // Creamos Controles de Formularios
      username: new FormControl("",
        Validators.compose([
          Validators.required, // Campo requerido
          Validators.minLength(5),
          Validators.maxLength(15),
          Validators.pattern("^[[A-Z]|[a-z]][[A-Z]|[a-z]|\\d|[_]]{7,29}$") // Expresión Regular para validar el username
        ])),
      password: new FormControl("",
        Validators.compose([
          Validators.required, // Campo requerido
          Validators.minLength(8),
          Validators.maxLength(20),
          Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')// Expresión Regular para validar el password
          /* 
            La pass debe 
            Minimo 8 caracteres
            Al menos una letra mayúscula
            Al menos una letra minuscula
            Al menos un dígito
            Al menos 1 caracter especial
          */
        ]))
    });
  }

  ngOnInit() {
    this.limpiarCampos();
  }

  ionViewDidEnter() {
    this.limpiarCampos();
  }

  //Resetea Formulario
  limpiarCampos() {
    this.loginForm.reset();
  }

  async iniciarSesion(credenciales) {
    // Enviamos un diccionario
    this.usuario = {
      usuario: credenciales.username,
      contrasenia: credenciales.password,
      tipo: 0 // Valor por defecto no se usa aquí
    };

    const carga = await this.loadingController.create({
      message: "Cargando ..."
    });

    await carga.present();

    this.apiService.iniciarSesionPOST(this.usuario).subscribe(
      (data) => {
        console.log(data);
        console.log(data.mensaje)
        if (data.mensaje == "Error") {
          // CARGA DE INICIO DE SESIÓN
          carga.dismiss();
          // Mensaje de Usuario o Contraseña incorrectas
          this.mensajeOk('¡Error!', '¡Usuario o contraseña incorrectos!');
        } else {
          this.authService.login(credenciales.username, credenciales.password, data.tipoUsuario, data.rut, data.bienvenida)
          // CARGA DE INICIO DE SESIÓN
          carga.dismiss();
        }

      },
      (error) => {
        // CARGA DE INICIO DE SESIÓN
        carga.dismiss();
        // Alerta de que los servidores están caídos, vuelva más tarde
        console.log(error);
        this.mensajeOk('¡Lo sentimos!', 'EL servicio no se encuentra disponible en este momento, vuelva más tarde.');
      }
    );
  }

  recuperarCuenta() {
    this.router.navigate(['/cambiar-contrasenia']);
    //this.router.navigate(['/tabs-profesor']);
    //this.router.navigate(['/tabs-alumno']);
    //this.router.navigate(['/test']);
  }

  paginaError(){
    this.router.navigate(['/paginaerror']);
  }

  // Alerta de confirmación
  async mensajeOk(titulo, mensaje) {
    const alert = await this.alertController.create({
      header: titulo,
      message: mensaje,
      buttons: ["OK"],
    })
    await alert.present();
    //Que se cierre cuando aprete el botón
    await alert.onDidDismiss();
  }

  // Agrego métodos get para validar el Formulario
  get username() { return this.loginForm.get('username'); }
  get password() { return this.loginForm.get('password'); }

}
