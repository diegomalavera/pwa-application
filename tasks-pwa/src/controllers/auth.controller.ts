import { Body, Controller, Post, Req, Get } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import type { Request } from 'express';
import { UserService } from 'src/services/user.service';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }, @Req() req: Request) {
    const { email, password } = body;

    if (!email || !password) {
      return {
        success: false,
        message: 'Email y contraseña son requeridos'
      };
    }

    const user = await this.userService.findByEmail(email);

    if (!user) {
      return {
        success: false,
        message: 'Email o contraseña inválidos'
      };
    }

    const isPasswordValid = await this.userService.validatePassword(password, user.password);

    if (!isPasswordValid) {
      return {
        success: false,
        message: 'Email o contraseña inválidos'
      };
    }

    req.session['user'] = { id: user.id, email: user.email, name: user.name };

    return {
      success: true,
      message: 'Login exitoso',
      user: { id: user.id, name: user.name, email: user.email }
    };
  }

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string },
    @Req() req: Request
  ) {
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return {
        success: false,
        message: 'Nombre, email y contraseña son requeridos'
      };
    }

    const existing = await this.userService.findByEmail(email);
    if (existing) {
      return {
        success: false,
        message: 'El email ya está registrado'
      };
    }

    const user = await this.userService.create(name, email, password);

    req.session['user'] = { id: user.id, email: user.email, name: user.name };
    return {
      success: true,
      message: 'Registro exitoso',
      user: { id: user.id, name: user.name, email: user.email }
    };
  }

  @Post('logout')
  logout(@Req() req: Request) {
    return new Promise((resolve) => {
      if (!req.session) {
        resolve({ success: true, message: 'Sesión cerrada' });
        return;
      }

      req.session.destroy((err) => {
        if (err) {
          resolve({ success: false, message: 'No se pudo cerrar la sesión' });
          return;
        }
        resolve({ success: true, message: 'Sesión cerrada' });
      });
    });
  }

  @Get('me')
  me(@Req() req: Request) {
    const user = (req.session as any)?.user;
    if (!user) {
      return { success: false, message: 'No autorizado' };
    }
    return { success: true, user };
  }
}
