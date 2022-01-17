/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'
import HealthCheck from '@ioc:Adonis/Core/HealthCheck'


Route.get('/', async () => {
  return { ping: 'pong' }
})

//Test Health of the server
Route.get('/health', async ({ response }) => {
	let report = await HealthCheck.getReport()
	return report.healthy ? response.ok(report) : response.badRequest(report)
})

Route.group(() => {
  Route.post("login", "UsersController.login")
  Route.post("link", "UsersController.link").middleware('auth')
  Route.post("islinked", "UsersController.isLinked").middleware('auth')
  Route.get("nfts", "UsersController.getNfts").middleware('auth')
}).prefix('/auth')

Route.group(() => {
  Route.get("all", "NftsController.all")
  Route.get(":id", "NftsController.get")
  Route.post("buy/:id", "NftsController.buy")
  Route.post("sell/:id", "NftsController.sell")
  Route.get("cdn/:id", "NtfsController.cdn")
}).prefix('/nfts').middleware('auth')