import Factory from '@ioc:Adonis/Lucid/Factory'
import Nft from 'App/Models/Nft'

export const NftFactory = Factory
  .define(Nft, ({ faker }) => {
    return {
      name: faker.lorem.word(),
      description: faker.lorem.paragraph(),
      forSale: false,
      price: 100,
      userId: 1
    }
  })
  .build()
