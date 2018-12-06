import { Tag } from './../../models/tag.model';
import { Subscription } from 'rxjs';
import { AngularFireAuth } from 'angularfire2/auth';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Task } from 'src/app/models/task.model';
import { TaskCategory } from 'src/app/models/task-category.enum';

@Component({
	selector: 'app-task-list',
	templateUrl: './task-list.component.html',
	styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit , OnDestroy {

	tasks:Task[] = [];
	tags:Tag[] = [];
	editingTaskId: string = null;
	newTaskDescription: string = '';
	currentUserId:string = '';
	targetCategory:TaskCategory = TaskCategory.Inbox;
	taskCategoryEnum = TaskCategory;
	taskListDataObservableSubscription:Subscription = null;
	tagListDataObservableSubscription:Subscription = null;

	constructor(private route: ActivatedRoute , private db:AngularFireDatabase,private af:AngularFireAuth) {
		this.currentUserId = this.af.auth.currentUser.uid
		if (route.snapshot.data.targetCategory !== null){
			this.targetCategory = route.snapshot.data.targetCategory;
		}
	}

	ngOnInit() {
		this.taskListDataObservableSubscription = this.db.list<Task>(`/tasks/${this.currentUserId}`).valueChanges().subscribe(x=>{
			this.tasks = x.filter(x=> x.category === this.targetCategory).sort((a,b) => (a.createdAt < b.createdAt) ? 1 : (a.createdAt > b.createdAt) ? -1 : 0);
		});
		this.tagListDataObservableSubscription = this.db.list<Tag>(`/tags/${this.currentUserId}`).valueChanges().subscribe(x=>{
			this.tags = x;
		});
	}

	ngOnDestroy(){
		this.taskListDataObservableSubscription.unsubscribe();
		this.tagListDataObservableSubscription.unsubscribe();
	}

	tryCreateTask(){
		if (this.newTaskDescription != ""){
			if(this.editingTaskId == null){
				var newTask = new Task();
				newTask.description = this.newTaskDescription;
				let toSend = this.db.object(`/tasks/${this.currentUserId}/${newTask.id}`);
				toSend.set(newTask).then( x =>{
					toSend.update({createdAt: new Date()});
				}).catch(x=>{
					console.log('Rejected');
				});
			}else{
				this.db.object(`/tasks/${this.currentUserId}/${this.editingTaskId}`).update({description:this.newTaskDescription});
			}
    		this.endEditingTask();
		}
	}

	endEditingTask(){
		this.editingTaskId = null;
		this.newTaskDescription = "";
	}

	findTagName(tagId: string){
		let targetTag:Tag = this.tags.filter((x) => x.id == tagId)[0];
		return (targetTag !== undefined && targetTag !== null)? targetTag.name : '';
	}

	addTag(taskId: string, tagId: string){
		let targetTask:Task = this.tasks.filter((x) => x.id == taskId)[0];
		if (targetTask.tags === undefined || targetTask.tags === null){
			targetTask.tags = [];
		}
		if (targetTask.tags.indexOf(tagId) === -1){
			targetTask.tags.push(tagId);
			this.db.object(`/tasks/${this.currentUserId}/${taskId}`).update({tags:targetTask.tags});
		}
	}

	removeTag(taskId: string, tagId: string){
		let targetTask:Task = this.tasks.filter((x) => x.id == taskId)[0];
		if (targetTask.tags === undefined || targetTask.tags === null){
			targetTask.tags = [];
		}
		if (targetTask.tags.indexOf(tagId) !== -1){
			targetTask.tags = targetTask.tags.filter(x=>x != tagId);
			this.db.object(`/tasks/${this.currentUserId}/${taskId}`).update({tags:targetTask.tags});
		}
	}

	newTaskInputKeyUp(e:KeyboardEvent){
		if (e.which == 13){
			this.tryCreateTask();
		}
		if (e.which==27){
			this.endEditingTask();
		}
	}

	newTaskClick(){
		this.tryCreateTask();
	}

	moveTask(id:string, newCategory:TaskCategory){
		this.db.object(`/tasks/${this.currentUserId}/${id}`).update({category:newCategory});
	}

	setEditingTask(id:string){
		this.editingTaskId = id;
		let targetTask:Task = this.tasks.filter((x) => x.id == id)[0];
		this.newTaskDescription = targetTask.description;
	}

	deleteTask(id:string){
		this.db.object(`/tasks/${this.currentUserId}/${id}`).remove();
	}

}
