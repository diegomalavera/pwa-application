import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Response } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const ctx = context.switchToHttp();

    const req = ctx.getRequest();
    const res = ctx.getResponse<Response>();

    if (req.session?.user) {
      return true;
    }

    res.redirect('/');
    return false;
  }
}