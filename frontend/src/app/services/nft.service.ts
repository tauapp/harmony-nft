import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Result } from 'src/contracts/result';
import { environment } from 'src/environments/environment';
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
  async listNftsForSale() {
    return (await axios.get(environment.server + "/nfts/all",
    {
      headers: {
        Authorization: "Bearer " + this.auth.currentUser.value!.token.token
      }
    })).data
  }

  async getNft(id: number) {
    return (await axios.get(environment.server + "/nfts/" + id)).data
  }

  async buyNft(id: number) {
    if(!await this.auth.isLinked()) {
      //Redirect to link page
      this.router.navigate(['/link'])
    }
    if(this.auth.currentUser != null) {
      //Use the API in backend to buy the NFT
      axios.post(environment.server + "/nfts/buy/" + id,
      {
        headers: {
          Authorization: "Bearer " + this.auth.currentUser.value!.token.token
        }
      })
      return Result.Success(null)
    } else {
      return Result.Error("You must be logged in to buy an NFT.")
    }
  }

  //Puts an NFT up for sale
  async putNftForSale(id: number, price: number) {
    if(!await this.auth.isLinked()) {
      //Redirect to link page
      this.router.navigate(['/link'])
    }
    if(this.auth.currentUser != null) {
      //Use the API in backend to put the NFT up for sale
      axios.post(environment.server + "/nfts/sell/" + id,
      {
        headers: {
          Authorization: "Bearer " + this.auth.currentUser.value!.token.token
        }
      })
      return Result.Success(null)
    } else {
      return Result.Error("You must be logged in to put an NFT up for sale.")
    }
  }

  //Lists a user's owned NFTS
  async listUserNfts() {
    if(this.auth.currentUser != null) {
      //Get user's owned nfts from the API from endpoint /auth/nfts
      let myNfts: Nft[] = (await axios.get(environment.server + "/auth/nfts",
      {
        headers: {
          Authorization: "Bearer " + this.auth.currentUser.value!.token.token
        }
      })).data
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
    return environment.server + "/nfts/cdn/" + id
  }
}
