import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetUser = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!data) return req.user;
    return req.user?.[data];
  },
);
