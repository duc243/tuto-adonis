import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { registerUserValidator } from '#validators/auth'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  register({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }
  async handleRegister({ request }: HttpContext) {
    const { username, email, password, thumbnail } =
      await request.validateUsing(registerUserValidator)
    if (!thumbnail) {
    } else {
      await thumbnail.move(app.makePath('public/users'), { name: `${cuid()}.${thumbnail.extname}` })
    }

    const filePath = `${thumbnail?.fileName}`
    await User.create({ username, email, password, thumbnail: filePath })
    return
  }
  login({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }
  async handleLogin({ request }: HttpContext) {
    return request.file('thumbnail')
  }
}
