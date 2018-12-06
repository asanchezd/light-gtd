import { AngularFireDatabase } from 'angularfire2/database';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { Router } from '@angular/router';
import { Task } from 'src/app/models/task.model';
import { TaskCategory } from 'src/app/models/task-category.enum';
import { Observable, Subscription } from 'rxjs';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	
	numberOfTasksInInbox:number = 0;
	numberOfTasksInSomeday:number = 0;
	numberOfTasksInScratchpad:number = 0;
	numberOfTasksInToday:number = 0;
	numberOfTasksInNext:number = 0;
	numberOfTasksInWaiting:number = 0;
	currentUserId:string = '';
	taskListDataObservableSubscription:Subscription = null;

	constructor(private af:AngularFireAuth,private router:Router,private db:AngularFireDatabase) { 
		this.currentUserId = this.af.auth.currentUser.uid
	}
	
	ngOnInit() {
		this.taskListDataObservableSubscription = this.db.list<Task>(`/tasks/${this.currentUserId}`).valueChanges().subscribe(x=>{
			this.numberOfTasksInInbox = x.filter(x=>x.category === TaskCategory.Inbox).length;
			this.numberOfTasksInSomeday = x.filter(x=>x.category === TaskCategory.Someday).length;
			this.numberOfTasksInScratchpad = x.filter(x=>x.category === TaskCategory.Scratchpad).length;
			this.numberOfTasksInToday = x.filter(x=>x.category === TaskCategory.Today).length;
			this.numberOfTasksInNext = x.filter(x=>x.category === TaskCategory.Next).length;
			this.numberOfTasksInWaiting = x.filter(x=>x.category === TaskCategory.Waiting).length;
		});
	}

	logOut(){
		this.taskListDataObservableSubscription.unsubscribe();
		this.router.navigate(['/login']).then( x => {
				this.af.auth.signOut();
			}
		);
	}
	
}
