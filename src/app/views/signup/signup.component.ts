import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
	
	state:string = '';
	error:any ;
	
	constructor(private af:AngularFireAuth,private router:Router) {

	}

	onSubmit(formData){
		if(formData.valid){
			if (formData.value.password === formData.value.passwordConfirm){
				this.af.auth.createUserWithEmailAndPassword(formData.value.email,formData.value.password).then(x=>{
					this.router.navigate(['/dashboard']);
				}).catch(err => {
					this.error = err;
				});
			}else{
				this.error = 'Passwords dont match'
			}
			
		}
	}
	
	ngOnInit() {
	}
	
}
