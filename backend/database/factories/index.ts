import Factory from '@ioc:Adonis/Lucid/Factory'
import Nft from 'App/Models/Nft'

export const NftFactory = Factory
  .define(Nft, ({ faker }) => {
    return {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      forSale: false,
      price: 100,
      userId: 1,
      imageUrl: "https://i.ibb.co/K0zjM9B/Screenshot-from-2022-01-06-18-27-21.png"
    }
  })
  .build()
