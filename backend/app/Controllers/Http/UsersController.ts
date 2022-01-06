import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'
import Stripe from 'stripe'
import Env from '@ioc:Adonis/Core/Env'

export default class UsersController {

    stripe = new Stripe(
        Env.get('STRIPE_SECRET_KEY'),
        {
            apiVersion: '2020-08-27',
        }
    )

    public async login ({ request, response, auth }: HttpContextContract) {
        const { email, password, name } = request.body()
        if(!email || !password || !name) {
            return response.status(400).json({ error: 'Missing email, password or name' })
        }

        let user = await User.findBy('username', email)

        if (!user) {
            user = await User.create({ email, password, name })
        }

        const token = await auth.use('api').attempt(email, password)

        return response.json(token)
    }
    
    public async link ({ request, response, auth }: HttpContextContract) {
        //TODO: Turn Stripe ID into customer ID
        
        const { customerId } = request.body()
        if(!customerId) {
            return response.status(400).json({ error: 'Missing customerId' })
        }
        const user = auth.user!
        let stripeCustomer = await this.stripe.customers.create({
            email: user.email,
            source: customerId,
        })

        //Create a stripe account linked to the customer ID
        this.stripe.accounts.create({
            type: 'custom',
            country: 'US',
            email: user.email,
            business_type: 'individual',
        })


        user.customerId = stripeCustomer.id
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
