import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Nfts extends BaseSchema {
  protected tableName = 'nfts'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name', 255).notNullable()
      table.string('description', 1024).notNullable()
      table.boolean('for_sale').notNullable()
      table.float('price').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table
        .foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE')

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
