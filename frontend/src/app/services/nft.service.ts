import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import axios from 'axios';
import { Result } from 'src/contracts/result';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';
import { Buffer } from 'buffer/';


export interface Nft {
  id: number,
  name: string
  description: string,
  forSale: boolean,
  price?: number,
  location?: string,
  user: {
    name: string,
    email: string
  }
}

@Injectable({
  providedIn: 'root'
})
export class NftService {

  constructor(private auth: AuthService, private router: Router) { }
  

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
    let nft = (await axios.get(environment.server + "/nfts/" + id, {
      headers:
      {
        Authorization: "Bearer " + this.auth.currentUser.value!.token.token
      }
    })).data as Nft

    nft.location = await this.getNftLocation(nft.id)
    return nft
  }

  async buyNft(id: number) {
    if(!await this.auth.isLinked()) {
      //Redirect to link page
      this.router.navigate(['/link'])
    }
    if(this.auth.currentUser.value != null) {
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
        price
      },
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
        for(let n of myNfts) {
          n.location = await this.getNftLocation(n.id)
        }
        return Result.Success(myNfts)
      } else {
        return Result.Error("You do not own any NFTs yet.")
      }
    } else {
      return Result.Error("You must be logged in to list your NFTs.")
    }
  }

  //Returns the location of an NFT by id
  async getNftLocation(id: number) {
    //Fetch image url from CDN
    let url = (await axios.get(environment.server + "/nfts/cdn/" + id, {
      headers: {
        Authorization: "Bearer " + this.auth.currentUser.value!.token.token
      }
    })).data as string

    return url
  }
}
