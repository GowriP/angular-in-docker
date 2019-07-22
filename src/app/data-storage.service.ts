import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TableData } from './TableData.model';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AddLeadComponent } from './add-lead/add-lead.component';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  rowChanged = new Subject<TableData>();

  constructor(private http: HttpClient, 
    public dialog: MatDialog ) { }

  tablerows: TableData[] = [];

  formdata  = {
    id: Number,
    created_at: String,
    updated_at: String,
    first_name: null, 
    last_name: null, 
    email: null, 
    mobile: null, 
    location_type: null,
    location_string: null,
    tags: null,
    communication: null
}

  getLeads() {
    let rows = []
    this.http.get<TableData>("http://localhost:8080/api/leads/?location_string=India").subscribe( data => {
      for ( var row in data) {
        data.hasOwnProperty(row) && rows.push(data[row])
        // this.formdata.first_name = data[row].first_name
        // this.formdata.last_name = data[row].last_name
        // this.formdata.email = data[row].email
        // this.formdata.mobile = data[row].mobile
        // this.formdata.location_type = data[row].location_type
        // this.formdata.location_string = data[row].location_string
        this.formdata = data[row];
        this.tablerows.push(this.formdata);  
      }
    })
    console.log(this.tablerows);
    this.rowChanged.next(this.tablerows.slice())
    return this.tablerows.slice();
  }

  dialogOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    const dialogRef = this.dialog.open(AddLeadComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(data => {
      this.http.post("http://localhost:8080/api/leads/", data).subscribe(info => {
      console.log(info);
    });
    })
  }

  deleteLead(id: number) {
    this.rowChanged.next(this.tablerows.slice())
    return this.http.delete("http://localhost:8080/api/leads/" + id);
   
  }

  getRows() {
    console.log(this.tablerows)
    return this.tablerows.slice();
  }

}
