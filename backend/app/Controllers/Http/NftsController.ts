import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Nft from 'App/Models/Nft'
import Stripe from 'stripe'
import Env from '@ioc:Adonis/Core/Env'
import Drive from '@ioc:Adonis/Core/Drive'
export default class NftsController {

    stripe = new Stripe(
        Env.get('STRIPE_SECRET_KEY'),
        {
            apiVersion: '2020-08-27',
        }
    )

    //List all NFTs for Sale
    public async all({ response, auth }: HttpContextContract) {
        const user = auth.user!
        const nfts = await Nft.query()
        .where('forSale', true)
        .whereNot('userId', user.id)
        return response.json(nfts)
    }

    //Get NFT by ID
    public async get({ params, response }: HttpContextContract) {
        const nft = await Nft.find(params.id)
        if (!nft) {
            return response.status(404).json({ error: 'NFT not found' })
        }
        await nft.load('user')
        return response.json(nft.serialize())
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
            await nft.load('user')
            return this.stripe.charges.create({
                amount: nft.price,
                currency: 'usd',
                customer: user.customerId,
                description: `${nft.user.name} bought the NFT named ${nft.name}`,
            })
            .then(() => {
                return this.stripe.transfers.create({
                    amount: nft.price,
                    currency: 'usd',
                    destination: nft.user.customerId,
                    description: `${user.name} sold the NFT named ${nft.name}`,
                })
            })
            .then(() => {
                nft.userId = user.id
                return nft.save()
            })
            .then(() => response.json(nft))
            .catch(err => response.status(500).json(err))
        } else {
            return response.status(400).json({ error: 'NFT is not for sale' })
        }
    }

    //Sell An NFT
    public async sell({ request, params, response, auth }: HttpContextContract) {
        const user = auth.user!
        const nft = await Nft.find(params.id)
        if (!nft) {
            return response.status(404).json({ error: 'NFT not found' })
        }
        nft.load('user')
        if(user.id != nft.userId) {
            response.status(400).json({ error: "You do not own that NFT."})
        }
        nft.forSale = true;
        nft.price = request.input('price')
        await nft.save()
        //Predeposit
        await this.stripe.charges.create({
            amount: nft.price * 0.15,
            currency: 'usd',
            customer: user.customerId,
            description: `${nft.user.name} paid a predeposit to secure their sale.`,
        })
        response.status(200).json("Success!")
    }

    public async cdn({ auth, params, response }: HttpContextContract) {
        const user = auth.user!
        const nft = await Nft.find(params.id)
        if(!nft) {
            return response.status(404).json({ error: "Nft not found" })
        }
        if(nft.userId != user.id) {
            return response.status(400).json({ error: "You do not own that NFT." })
        }
        let pic = await Drive.get(nft.id + ".png")

        return pic
    }
}