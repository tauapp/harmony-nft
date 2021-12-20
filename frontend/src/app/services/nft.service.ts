import { Injectable } from '@angular/core';

export interface Nft {
  id: number,
  owner: number,
  name: string,
  price: number
}

@Injectable({
  providedIn: 'root'
})
export class NftService {

  constructor() { }

  //REPLACED BY API
  private nfts: Nft[] = []

  loadNfts(page: number): Nft[] {
    return this.nfts.slice((page - 1) * 10, page * 10)
  }
}
