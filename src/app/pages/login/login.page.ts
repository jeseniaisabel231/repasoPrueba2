import { Component, OnInit } from '@angular/core';
import { FormGroup , FormBuilder , Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController , LoadingController } from '@ionic/angular';
import { ChatService } from 'src/app/services/chat.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  //variable: tipo
  credentialForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController,
    private chatService: ChatService
  ) { }

  ngOnInit() {
    //fb es una abreviatura para utilizar FormBuilder, con .group crea un grupo de controles
    this.credentialForm = this.fb.group({
      email: ["" , [Validators.required , Validators.email]],
      //Validators.required: El campo es obligatorio. Si el usuario no escribe nada, será inválido.
      //Validators.email: El valor ingresado debe tener el formato de un correo electrónico válido (como ejemplo@correo.com).
      password: ["" , [Validators.required , Validators.minLength(6)]]
    })
  }

  async signUp() {
    const loading = await this.loadingController.create();//componente de carga
    await loading.present();//spinner sea invisible en la pantalla

    //pedimos al servidor (a través de chatService) que registre al usuario.
    this.chatService
    .signUp(this.credentialForm.value)
    //this.credentialForm.value: se obtiene los datos que el usuario escrio en el formulario

    //se espera 2 posibles resultados
    .then(//registro exitoso
      (user) => {
        loading.dismiss();//cierra el spinner de carga
        this.router.navigateByUrl("/chat" , { replaceUrl: true });
        // this.router.navigateByUrl(...): Redirige al usuario a la página principal del chat (la ruta /chat), indicando que no se puede volver atrás (con replaceUrl: true).
      },

      //error al registrarse
      async (err) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: "Error",
          message: err.message,
          buttons: ["Ok"]
        });
        await alert.present();
      }
    )
  }

  async signIn() {
    const loading = await this.loadingController.create();
    await loading.present();
    this.chatService
    .signIn(this.credentialForm.value)
    .then(
      (res) => {
        loading.dismiss();
        this.router.navigateByUrl("/chat" , { replaceUrl: true });
      },
      async (err) => {
        loading.dismiss();
        const alert = await this.alertController.create({
          header: "Error",
          message: err.message,
          buttons: ["Ok"]
        })
        await alert.present();
      }
    )
  }

  get email() {
    return this.credentialForm.get("email");
  }

  get password() {
    return this.credentialForm.get("password");
  }
}