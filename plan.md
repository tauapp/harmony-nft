# Frontend pages plan for NFT

## Landing
### Path: / 
A basic landing page explaining our rocketry club and the NFT platform.

## Login
### Path: /login
Login a user using google only(No username-password shenanigans)

## Home
### Path: /home or / if logged in
Shows the user the newest NFTs for sale, their owned NFTs, and a search bar

## Buy
### Path /nft/:id
If the NFT is for sale, shows the NFT screen. Otherwise, gives a warning.

## Checkout
### Path /link
Link user payment credentials to account

# Don't forget the secret easter egg tradition!


# Backend REST Routes


## Authorization
### /auth
Gets a user's google credentials and either registers or verifies them.

## List User NFTs
## GET /user/nfts
## Payload: Auth info
List all the NFTs owned by the user

## List NFTs
### GET /nft/all?page=number
Gets 10 NFTs by page number

## NFT Details
### GET /nft/:id
Gets a NFT by ID and lists its properties

## Buy NFT
### POST /nft/buy/:id
### Payload: TBD
Recieve payment credentials and claim the NFT for the user

## Sell NFT
### POST /nft/sell/:id
### Payload: TBD
Puts an NFT up for sale. Returns true if payment credentials are there, returns false if not.

## CDN Mirror
### POST /cdn/:id
### Payload: Auth data
If an NFT is owned by a user, serve the NFT by ID.

## Payment Link
### POST /payments/link
Links a user to a Stripe customer for later use.

## Is Payment Linked
### GET /payments/islinked
Returns a boolean: If the user is already linked to a Stripe customer.

## Backend Models:

```ts
User {
    id: number

    username: string

    key: string

    customerId: string

    @hasMany(() => NFT)
    ntfs: HasMany<typeof NFT>
}
```

```ts
NFT {
    id: number

    name: string

    description: string

    forSale: boolean

    price: number?

    //Image link URL
    location: string

    @hasOne(() => User)
    owner: HasOne<typeof User>

}
```