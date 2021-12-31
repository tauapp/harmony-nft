import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-confirm-buy',
  templateUrl: './confirm-buy.component.html',
  styleUrls: ['./confirm-buy.component.css']
})
export class ConfirmBuyComponent implements OnInit {

  constructor(
    public storage: StorageService,
    public dialogRef: MatDialogRef<ConfirmBuyComponent>
    ) { }

  ngOnInit(): void {
  }

  confirmPurchase() {
    this.storage.nftToBuy = undefined
    this.dialogRef.close(true)
  }

  cancel() {
    this.storage.nftToBuy = undefined
    this.dialogRef.close(false)
  }

}
