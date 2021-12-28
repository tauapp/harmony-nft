import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Nft, NftService } from 'src/app/services/nft.service';

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
    public authService: AuthService
    ) { }

  nftId: number = 0

  nft: Nft = {
    id: 0,
    name: "",
    description: "",
    owner: 0,
    price: 0,
    forSale: false,
    location: ""
  }

  isOwner: boolean = false

  ngOnInit(): void {
    let id  = this.activatedRoute.snapshot.paramMap.get("id")
    if(!id) {
      //Navigate back
      this.router.navigate(['/home'])
    } else {
      this.nftId = parseInt(id)
      this.nft = this.nftService.getNft(this.nftId)
      //Check if the user is the owner of the nft
      if(this.authService.currentUser.value) {
        this.isOwner = this.authService.currentUser.value.id == this.nft.owner
      }
    }
  }

  download() {
    fetch(this.nftService.getNftLocation(this.nftId))
    .then(res => res.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.nft.name + ".jpeg";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    })
  }
}
