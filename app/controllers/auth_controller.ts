import type { HttpContext } from '@adonisjs/core/http'

export default class AuthController {
  register({ view }: HttpContext) {
    return view.render('pages/auth/register')
  }
  async handleRegister({ request }: HttpContext) {
    return request.file('thumbnail')
  }
  login({ view }: HttpContext) {
    return view.render('pages/auth/login')
  }
  async handleLogin({ request }: HttpContext) {
    return request.file('thumbnail')
  }
}
