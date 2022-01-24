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
                amount: nft.price * 100,
                currency: 'usd',
                description: `${user.name} bought the NFT named ${nft.name}`,
                customer: user.customerId,
                confirm: true,
            })
            .then(() => {
                return this.stripe.transfers.create({
                    amount: nft.price * 100,
                    currency: 'usd',
                    destination: nft.user.connectId,
                    description: `${user.name} sold the NFT named ${nft.name}`
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
        //Predeposit
        await this.stripe.paymentIntents.create({
            amount: nft.price * 0.15 * 100,
            currency: 'usd',
            description: `${user.name} paid a predeposit to secure their sale.`,
            customer: user.customerId,
            confirm: true,
        })
        nft.forSale = true;
        nft.price = request.input('price')
        await nft.save()
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
        const source: string = request.input('customerId')
        const routing: number = request.input('routing')
        const bank: number = request.input('account')
        if(!source) {
            return response.status(400).json({ error: 'Missing customerId' })
        }

        const user = auth.user!


        console.log(routing.toString().length)

        let account = await this.stripe.accounts.create({
            type: 'custom',
            country: 'US',
            email: user.email,
            capabilities: {
                card_payments: {
                    requested: true,
                },
                transfers: {
                    requested: true,
                },
            },
            business_type: 'individual',
            default_currency: 'usd',
            individual: {
                first_name: user.name.split(" ")[0],
                last_name: user.name.split(" ")[user.name.length - 1],
                email: user.email,
                ssn_last_4: '1234',
            },
            tos_acceptance: {
                date: Math.floor(Date.now() / 1000),
                ip: request.ip(),
            },
            external_account: {
                object: 'bank_account',
                country: 'US',
                currency: 'usd',
                routing_number: routing.toString(),
                account_number: bank.toString(),
            }
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
