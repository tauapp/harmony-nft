import { Component, OnInit } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmBuyComponent } from 'src/app/components/confirm-buy/confirm-buy.component';
import { ConfirmSaleComponent } from 'src/app/components/confirm-sale/confirm-sale.component';
import { AuthService } from 'src/app/services/auth.service';
import { Nft, NftService } from 'src/app/services/nft.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-nft',
  templateUrl: './nft.component.html',
  styleUrls: ['./nft.component.css']
})
export class NftComponent implements OnInit {

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    public nftService: NftService,
    public authService: AuthService,
    private dialog: MatDialog,
    private storage: StorageService
    ) { }

  nftId: number = 0

  nft: Nft = {
    id: 0,
    name: "",
    description: "",
    owner: 0,
    price: 0,
    forSale: false,
    location: ""
  }

  isOwner: boolean = false

  ngOnInit(): void {
    let id  = this.activatedRoute.snapshot.paramMap.get("id")
    if(!id) {
      //Navigate back
      this.router.navigate(['/home'])
    } else {
      this.nftId = parseInt(id)
      this.nft = this.nftService.getNft(this.nftId)
      //Check if the user is the owner of the nft
      if(this.authService.currentUser.value) {
        this.isOwner = this.authService.currentUser.value.id == this.nft.owner
      }
    }
  }

  download() {
    //If the user does not own the NFT, then return
    if(!this.isOwner) {
      return
    }
    fetch(this.nftService.getNftLocation(this.nftId))
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.nft.name + ".jpeg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  putUpForSale() {

    this.storage.nftToSell = this.nft

    let confirm = this.dialog.open(ConfirmSaleComponent, {
      height: '500px',
      width: '500px',
      autoFocus: false,
      restoreFocus: false
    })

    confirm.afterClosed().subscribe(result => {
      if(result != 0) {
        this.storage.priceToSell = parseFloat(result)
        this.nftService.putNftForSale(this.nftId, result)
      }
      this.storage.nftToSell = undefined
      this.storage.priceToSell = undefined
    })
  }

  buyNft() {
    this.storage.nftToBuy = this.nft


    let confirm = this.dialog.open(ConfirmBuyComponent, {
      height: '500px',
      width: '500px',
      autoFocus: false,
      restoreFocus: false
    })

    confirm.afterClosed().subscribe(result => {
      if(result) {
        this.nftService.buyNft(this.nftId)
      }
      this.storage.nftToBuy = undefined
    })
  }
}
