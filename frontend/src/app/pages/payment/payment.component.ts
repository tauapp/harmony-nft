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
    if(auth.isLinked()) {
      router.navigate(['/home'])
    }
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

  link() {
    if (this.card) {
      this.stripe?.createToken(this.card).then(result => {
        if(result.error) {
          this.snackbar.open(result.error.message!, "OK", {duration: 2000})
        }
        else {
          let token = result.token
          this.auth.link(token.id)
          //If there is an NFT to buy, then buy it
          if(this.storage.nftToBuy) {
            this.nft.buyNft(this.storage.nftToBuy.id).match({
              Success: () => this.router.navigate(['/home']),
              Error: (error) => this.snackbar.open(error, "OK", {duration: 2000})
            })
            
          } else if (this.storage.nftToSell) {
            this.nft.putNftForSale(this.storage.nftToSell.id, this.storage.priceToSell!).match({
              Success: () => this.router.navigate(['/home']),
              Error: (error) => this.snackbar.open(error, "OK", {duration: 2000})
            })
          }
          else {
            this.router.navigate(['/home'])
          }
        }
      })
    }
  }
}
