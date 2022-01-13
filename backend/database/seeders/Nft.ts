import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Nft from 'App/Models/Nft'
import { NftFactory } from 'Database/factories'

export default class NftSeeder extends BaseSeeder {
  public async run () {
    // Write your database queries inside the run method
    await NftFactory.createMany(5)
  }
}
