import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { AuthService } from 'src/app/services/auth.service';
import { NftService } from 'src/app/services/nft.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  constructor(
    private snackbar: MatSnackBar,
    private auth: AuthService,
    private router: Router,
    private storage: StorageService,
    private nft: NftService
  ) { 
    auth.isLinked()
    .then(isLinked => {
      if(isLinked) {
        router.navigate(['/home'])
      }
    })
  }

  stripe: Stripe | null = null;

  ngOnInit(): void {
    loadStripe("pk_test_51KDtq1KXBsfF3oGeUxycBjQd99Uf0qMRoXBBY9ETXUjNnETo2PH5BvJrh2mG55rwWzy1sKLbzKgFsJe9gkemAd3200Jq6S6BPu")
    .then(stripe => {
      this.stripe = stripe
      const cardStyle = {
        base: {
            color: '#32325d',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    }
    this.card = stripe!.elements().create('card', {style: cardStyle})
    this.card?.mount("#stripe")
    })
  }

  card?: StripeCardElement;

  cardError?: string;

  async link() {
    if (this.card) {
      let result = await this.stripe?.createSource(this.card, {
        currency: 'usd',
        type: 'card'
      })!
        if(result.error) {
          this.snackbar.open(result.error.message!, "OK", {duration: 2000})
        }
        else {
          let token = result.source
          await this.auth.link(token.id)
          //If there is an NFT to buy, then buy it
          if(this.storage.nftToBuy) {
            (await this.nft.buyNft(this.storage.nftToBuy.id)).match({
              Success: () => this.router.navigate(['/home']),
              Error: (error) => this.snackbar.open(error, "OK", {duration: 2000})
            })
            
          } else if (this.storage.nftToSell) {
            (await this.nft.putNftForSale(this.storage.nftToSell.id, this.storage.priceToSell!)).match({
              Success: () => this.router.navigate(['/home']),
              Error: (error: string) => this.snackbar.open(error, "OK", {duration: 2000})
            })
          }
          else {
            this.router.navigate(['/home'])
          }
        }
    }
  }
}
