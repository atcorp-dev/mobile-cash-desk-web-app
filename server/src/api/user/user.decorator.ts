import { createParamDecorator } from '@nestjs/common';

export const SessionUser = createParamDecorator((data, req) => {
  return req.session.passport.user;
})

export const ReqUser = createParamDecorator((data, req) => {
  return req.user;
});