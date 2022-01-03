import { Injectable } from '@angular/core';
import { Nft } from './nft.service';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  nftToBuy?: Nft

  nftToSell?: Nft

  priceToSell?: number
}
