import { Tag } from './../../models/tag.model';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database';
import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-tags-list',
	templateUrl: './tags-list.component.html',
	styleUrls: ['./tags-list.component.scss']
})
export class TagsListComponent implements OnInit {

	tags: Tag[];
	currentUserId: string = '';
	newTagName: string = '';
	tagListDataObservableSubscription: Subscription = null;

	constructor( private db:AngularFireDatabase,private af:AngularFireAuth) {
		this.currentUserId = this.af.auth.currentUser.uid
	}

	ngOnInit() {
		this.tagListDataObservableSubscription = this.db.list<Tag>(`/tags/${this.currentUserId}`).valueChanges().subscribe(x=>{
			this.tags = x.sort((a,b) => (a.name < b.name) ? -1 : (a.name > b.name) ? 1 : 0);
		});
	}

	ngOnDestroy(){
		this.tagListDataObservableSubscription.unsubscribe();
	}
	
	tryCreateTag(){
		if (this.newTagName != ""){
			if(this.tags.filter(x => x.name == this.newTagName).length == 0){
				var newTag = new Tag();
				newTag.name = this.newTagName;
				let toSend = this.db.object(`/tags/${this.currentUserId}/${newTag.id}`);
				toSend.set(newTag).catch(x=>{
					console.log('Rejected');
				});
				this.newTagName = "";
			}
		}
	}

	newTagInputKeyUp(e:KeyboardEvent){
		if (e.which == 13){
			this.tryCreateTag()
		}
	}

	newTagClick(){
		this.tryCreateTag()
	}

	deleteTag(id:string){
		this.db.object(`/tags/${this.currentUserId}/${id}`).remove();
	}

}
