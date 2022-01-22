import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import { NftFactory } from 'Database/factories'
import Nft from 'App/Models/Nft'

export default class NftSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await NftFactory.createMany(5)
    await Nft.create({
      name: "Test",
      description: "Test",
      forSale: false,
      price: 100,
      imageUrl: "https://i.ibb.co/K0zjM9B/Screenshot-from-2022-01-06-18-27-21.png",
      userId: 2
    })
  }
}
