import { Nft, NftService } from 'src/app/services/nft.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(
    public auth: AuthService,
    public nftService: NftService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  nfts: Nft[] = []
  public nftsForSale: Nft[] = []

  //When an nft is clicked, it navigates to its page
  onNftClick(nft: Nft) {
    this.router.navigate(['/nft', nft.id])
  }

  async ngOnInit() {

    this.nftsForSale = await this.nftService.listNftsForSale()

    this.nfts = (await this.nftService.listUserNfts()).match({
      Success: (nfts) => nfts,
      Error: (err) => {
        this.snackBar.open(err, "Dismiss", {
          duration: 2000
        })

        return []
      }
    })
  }

}
