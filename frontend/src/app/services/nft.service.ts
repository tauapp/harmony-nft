import { Injectable } from '@angular/core';
import { Result } from 'src/contracts/result';
import { AuthService } from './auth.service';

export interface Nft {
  id: number,
  name: string
  description: string,
  forSale: boolean,
  price?: number,
  location: string,
  owner: number
}

@Injectable({
  providedIn: 'root'
})
export class NftService {

  constructor(private auth: AuthService) { }

  //REPLACED BY API
  private nfts: Nft[] = [
    {
      id: 0,
      name: "Green Square",
      description: "A vintage green square painted by the infamous 12th-century painter Deonardo LaVinci.",
      forSale: true,
      price: 10_000,
      location: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Green_square.svg/1200px-Green_square.svg.png",
      owner: 0
    }
  ]

  loadNfts(page: number): Nft[] {
    if (this.nfts.length < 10) {
      return this.nfts
    } else {
      return this.nfts.slice((page - 1) * 10, page * 10)
    }
  }

  getNft(id: number) {
    return this.nfts[id]
  }

  buyNft(id: number) {
    if(this.auth.currentUser != null) {
      if(this.nfts[id].forSale) {
        this.nfts[id].forSale = false
        this.nfts[id].owner = this.auth.currentUser.value!.id
        return Result.Success
      } else {
        return Result.Error("NFT is not for sale.")
      }
    } else {
      return Result.Error("You must be logged in to buy an NFT.")
    }
  }

  //Puts an NFT up for sale
  putNftForSale(id: number, price: number) {
    if(this.auth.currentUser != null) {
      if(this.nfts[id].owner == this.auth.currentUser.value!.id) {
        this.nfts[id].forSale = true
        this.nfts[id].price = price
        return Result.Success
      } else {
        return Result.Error("You are not the owner of this NFT.")
      }
    } else {
      return Result.Error("You must be logged in to put an NFT up for sale.")
    }
  }
}
