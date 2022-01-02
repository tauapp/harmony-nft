import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-confirm-sale',
  templateUrl: './confirm-sale.component.html',
  styleUrls: ['./confirm-sale.component.css']
})
export class ConfirmSaleComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<ConfirmSaleComponent>,
    public storage: StorageService
    ) { }

  ngOnInit(): void {
  }

  //The two modal modes: Confirm mode and price mode.
  confirmMode = true

  price = ""

  //Template Injections
  parseInt = parseInt; parseFloat=parseFloat; Math = Math; Number = Number;

  putUpForSale() {
    this.confirmMode = false
  }

  confirmPrice() {
    this.dialogRef.close(this.price)
  }

  cancel() {
    this.dialogRef.close(0)
  }

}
