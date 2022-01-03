import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
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

  constructor(private auth: AuthService, private router: Router) { }

  //REPLACED BY API
  private nfts: Nft[] = [
    {
      id: 0,
      name: "Green Square",
      description: "A vintage green square painted by the infamous 12th-century painter Deonardo LaVinci.",
      forSale: true,
      price: 10_000,
      location: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Green_square.svg/1200px-Green_square.svg.png",
      owner: 1
    },
    {
      id: 1,
      name: "Red Square",
      description: "A red square symbolizing the indisputable soupiness of cereal.",
      forSale: false,
      price: 10_000,
      location: "https://www.americasfinestlabels.com/includes/work/image_cache/4b4f4b63cc837b5f01ce2d718b0f9be2.thumb.jpg",
      owner: 0
    },
    {
      id: 2,
      name: "Rico Astlé",
      description: "A mysterious man who shows up seemingly every time you click a link your friend sent you.",
      forSale: true,
      price: 100,
      location: "https://variety.com/wp-content/uploads/2021/07/Rick-Astley-Never-Gonna-Give-You-Up.png?w=1024",
      owner: 1
    }
  ]

  //Return all nfts which are for sale and not owned by the current user
  listNftsForSale(/*page: number*/) {
    return this.nfts.filter(nft => nft.forSale && nft.owner != this.auth.currentUser.value!.id)
  }

  getNft(id: number) {
    return this.nfts[id]
  }

  buyNft(id: number) {
    if(!this.auth.isLinked()) {
      //Redirect to link page
      this.router.navigate(['/link'])
    }
    if(this.auth.currentUser != null) {
      if(this.nfts[id].forSale) {
        this.nfts[id].forSale = false
        this.nfts[id].owner = this.auth.currentUser.value!.id
        return Result.Success(null)
      } else {
        return Result.Error("NFT is not for sale.")
      }
    } else {
      return Result.Error("You must be logged in to buy an NFT.")
    }
  }

  //Puts an NFT up for sale
  putNftForSale(id: number, price: number) {
    if(!this.auth.isLinked()) {
      //Redirect to link page
      this.router.navigate(['/link'])
    }
    if(this.auth.currentUser != null) {
      if(this.nfts[id].owner == this.auth.currentUser.value!.id) {
        this.nfts[id].forSale = true
        this.nfts[id].price = price
        return Result.Success(null)
      } else {
        return Result.Error("You are not the owner of this NFT.")
      }
    } else {
      return Result.Error("You must be logged in to put an NFT up for sale.")
    }
  }

  //Lists a user's owned NFTS
  listUserNfts() {
    if(this.auth.currentUser != null) {
      let myNfts = this.nfts.filter(nft => nft.owner == this.auth.currentUser.value!.id)
      if(myNfts.length > 0) {
        return Result.Success(myNfts)
      } else {
        return Result.Error("You do not own any NFTs yet.")
      }
    } else {
      return Result.Error("You must be logged in to list your NFTs.")
    }
  }

  //Returns the location of an NFT by id
  getNftLocation(id: number) {
    return this.nfts[id].location
  }
}
