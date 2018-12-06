import { AuthenticatedGuard } from './security/guards/authenticated.guard';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './views/login/login.component';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { SignupComponent } from './views/signup/signup.component';
import { FormsModule } from '@angular/forms';
import { NotAvailableComponent } from './views/not-available/not-available.component';
import { TaskListComponent } from './components/task-list/task-list.component';
import { TaskCategory } from './models/task-category.enum';
import { TagsListComponent } from './components/tags-list/tags-list.component';

const appRoutes: Routes = [
	{ path: '', redirectTo: '/dashboard/inbox', pathMatch: 'full' },
	{ path: 'login', component: LoginComponent },
	{
		path: 'dashboard', component: DashboardComponent, canActivate: [AuthenticatedGuard],
		children: [
			{ path: '', redirectTo: 'inbox', pathMatch: 'full' },
			{ path: 'inbox', component: TaskListComponent, data: {targetCategory:TaskCategory.Inbox} },
			{ path: 'someday', component: TaskListComponent, data: {targetCategory:TaskCategory.Someday} },
			{ path: 'scratchpad', component: TaskListComponent, data: {targetCategory:TaskCategory.Scratchpad} },
			{ path: 'today', component: TaskListComponent, data: {targetCategory:TaskCategory.Today} },
			{ path: 'next', component: TaskListComponent, data: {targetCategory:TaskCategory.Next} },
			{ path: 'waiting', component: TaskListComponent, data: {targetCategory:TaskCategory.Waiting} },
			{ path: 'archive', component: TaskListComponent, data: {targetCategory:TaskCategory.Archive} },
			{ path: 'tags', component: TagsListComponent},
		]
	},
	{ path: 'signup', component: SignupComponent },
	{ path: '**', component: NotAvailableComponent }
];

@NgModule({
	declarations: [
		AppComponent,
		LoginComponent,
		DashboardComponent,
		SignupComponent,
		NotAvailableComponent,
		TaskListComponent,
		TagsListComponent
	],
	imports: [
		BrowserModule,
		RouterModule.forRoot(appRoutes),
		MDBBootstrapModule.forRoot(),
		AngularFireModule.initializeApp(environment.firebase),
		AngularFireDatabaseModule,
		AngularFireAuthModule,
		FormsModule
	],
	providers: [],
	bootstrap: [AppComponent]
})
export class AppModule { }
