import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-sale',
  templateUrl: './confirm-sale.component.html',
  styleUrls: ['./confirm-sale.component.css']
})
export class ConfirmSaleComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ConfirmSaleComponent>) { }

  ngOnInit(): void {
  }

  //The two modal modes: Confirm mode and price mode.
  confirmMode = true

  price = ""

  //Inject parseInt into template for validation
  parseInt = parseInt

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
