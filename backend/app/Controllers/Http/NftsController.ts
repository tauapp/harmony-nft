import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Nft from 'App/Models/Nft'
import Stripe from 'stripe'
import Env from '@ioc:Adonis/Core/Env'

export default class NftsController {

    stripe = new Stripe(
        Env.get('STRIPE_SECRET_KEY'),
        {
            apiVersion: '2020-08-27',
        }
    )

    //List all NFTs for Sale
    public async all({ response }: HttpContextContract) {
        const nfts = await Nft.query().where('forSale', true)
        return response.json(nfts)
    }

    //Get NFT by ID
    public async get({ params, response }: HttpContextContract) {
        const nft = await Nft.find(params.id)
        return response.json(nft)
    }

    //Buy an NFT
    public async buy({ params, response, auth }: HttpContextContract) {
        const user = auth.user!
        const nft = await Nft.find(params.id)
        if (!nft) {
            return response.status(404).json({ error: 'NFT not found' })
        }
        if (nft.forSale) {
            nft.forSale = false
            await nft.load('owner')
            await this.stripe.charges.create({
                amount: nft.price,
                currency: 'usd',
                customer: user.customerId,
                description: `${nft.owner.name} bought ${nft.name}`,
            })
            //Payout NFT price to owner
            await this.stripe.transfers.create({
                amount: nft.price * 0.85,
                currency: 'usd',
                destination: nft.owner.customerId,
                description: `${user.name} sold ${nft.name}`,
            })
            nft.ownerId = user.id
            await nft.save()
            return response.json(nft)
        } else {
            return response.status(400).json({ error: 'NFT is not for sale' })
        }
    }
}
