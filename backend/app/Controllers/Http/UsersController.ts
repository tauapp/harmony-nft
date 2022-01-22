import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Stripe from 'stripe'
import Env from '@ioc:Adonis/Core/Env'
import Nft from 'App/Models/Nft'
import send from 'send'

export default class UsersController {

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
            return this.stripe.paymentIntents.create({
                amount: nft.price,
                currency: 'usd',
                description: `${nft.user.name} bought the NFT named ${nft.name}`,
            }, {
                stripeAccount: user.customerId
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
        await this.stripe.paymentIntents.create({
            amount: nft.price * 0.15,
            currency: 'usd',
            description: `${nft.user.name} paid a predeposit to secure their sale.`,
        }, {
            stripeAccount: user.customerId
        })
        response.status(200).json("Success!")
    }

    public async cdn({ params, response, auth }: HttpContextContract) {
        const nft = await Nft.find(params.id)
        if(!nft) {
            return response.status(404).json({ error: "Nft not found" })
        }
        //Make sure user owns NFT
        if(auth.user!.id !== nft.userId) {
            return response.status(400).json({ error: "You do not own that NFT." })
        }
        return nft!.imageUrl
    }

    public async login ({ request, response, auth }: HttpContextContract) {
        const { email, password, name } = request.body()
        if(!email || !password || !name) {
            return response.status(400).json({ error: 'Missing email, password or name' })
        }

        let user = await User.findBy('email', email)

        if (!user) {
            user = await User.create({ email, password, name })
        }

        const token = await auth.use('api').attempt(email, password)

        return response.json(token)
    }
    
    public async link ({ request, response, auth }: HttpContextContract) {        
        const source = request.body().customerId
        if(!source) {
            return response.status(400).json({ error: 'Missing customerId' })
        }

        const user = auth.user!


        let account = await this.stripe.accounts.create({
            type: 'custom',
            country: 'US',
            email: user.email,
        })

        await this.stripe.customers.create({
            name: user.name,
            email: user.email,
            source
        }, {
            stripeAccount: account.id
        })
        user.customerId = account.id
        await user.save()
        return response.json(user)
    }
    
    public async isLinked ({ response, auth }: HttpContextContract) {
        const user = auth.user!
        return response.json({ isLinked: user.customerId !== null })
    }
    
    public async getNfts ({ response, auth }: HttpContextContract) {
        const user = auth.user!
        await user.load('nfts')
        return response.json(user.serialize().nfts)
    }
}
