import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { StorageServiceModule} from 'angular-webstorage-service';
import * as $ from 'jquery';
import * as bootstrap from "bootstrap";


import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent    
  ],
  imports: [
    BrowserModule,
    StorageServiceModule
  ],
  schemas: [ NO_ERRORS_SCHEMA],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
