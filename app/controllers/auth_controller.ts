import User from '#models/user'
import app from '@adonisjs/core/services/app'
import { registerUserValidator } from '#validators/auth'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import { toPng } from 'jdenticon'
import { writeFile } from 'node:fs/promises'

export default class AuthController {
  register({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }
  async handleRegister({ request, session, response }: HttpContext) {
    const { username, email, password, thumbnail } =
      await request.validateUsing(registerUserValidator)
    if (!thumbnail) {
      const pngBuffer = toPng(username, 100)
      const pngUint8Array = new Uint8Array(pngBuffer)
      await writeFile(`public/users${username}.png`, pngUint8Array)
    } else {
      await thumbnail.move(app.makePath('public/users'), { name: `${cuid()}.${thumbnail.extname}` })
    }

    const filePath = `users/${thumbnail?.fileName || username + '.png'}`
    await User.create({ username, email, password, thumbnail: filePath })
    session.flash('success', 'Inscription réussi!!')
    return response.redirect().toRoute('home')
  }
  login({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }
  async handleLogin({ request }: HttpContext) {
    return request.file('thumbnail')
  }
}
