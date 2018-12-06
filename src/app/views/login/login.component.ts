import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	state:string = '';
	error:any ;

	constructor(private af:AngularFireAuth,private router:Router) { }

	ngOnInit() {
	}

	onSubmit(formData){
		if(formData.valid){
			this.af.auth.signInWithEmailAndPassword(formData.value.email,formData.value.password).then(x=>{
				this.router.navigate(['/dashboard']);
			}).catch(err => {
				this.error = err;
			});
		}
	}

}
