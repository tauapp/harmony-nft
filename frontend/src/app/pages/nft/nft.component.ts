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
    user: {
      name: "",
      email: ""
    },
    price: 0,
    forSale: false
  }

  isOwner: boolean = false

  async ngOnInit() {
    let id  = this.activatedRoute.snapshot.paramMap.get("id")
    if(!id) {
      //Navigate back
      this.router.navigate(['/home'])
    } else {
      this.nftId = parseInt(id)
      this.nft = await this.nftService.getNft(this.nftId)
      //Check if the user is the owner of the nft
      if(this.authService.currentUser.value) {
        this.isOwner = this.authService.currentUser.value.email == this.nft.user.email
      }
    }
  }

  download() {
    //If the user does not own the NFT, then return
    if(!this.isOwner) {
      return
    }
    this.nftService.getNftLocation(this.nftId).then(url => {
      return fetch(url)
    })
    .then(res => res.blob())
    .then(blob => {
      //Make object URL from blob
      let url = window.URL.createObjectURL(blob)
      const a = document.createElement('a');
      a.href = url;
      a.download = this.nft.name + ".jpeg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }

  async putUpForSale() {

    this.storage.nftToSell = this.nft

    let confirm = this.dialog.open(ConfirmSaleComponent, {
      height: '500px',
      width: '500px',
      autoFocus: false,
      restoreFocus: false
    })

    confirm.afterClosed().subscribe(async result => {
      if(result != 0) {
        this.storage.priceToSell = parseFloat(result)
        await this.nftService.putNftForSale(this.nftId, result)
      }
      this.storage.nftToSell = undefined
      this.storage.priceToSell = undefined
    })
  }

  async buyNft() {
    this.storage.nftToBuy = this.nft


    let confirm = this.dialog.open(ConfirmBuyComponent, {
      height: '500px',
      width: '500px',
      autoFocus: false,
      restoreFocus: false
    })

    confirm.afterClosed().subscribe(async result => {
      if(result) {
        await this.nftService.buyNft(this.nftId)
      }
      this.storage.nftToBuy = undefined
    })
  }
}
