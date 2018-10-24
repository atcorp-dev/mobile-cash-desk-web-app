import { ExceptionFilter, ArgumentsHost, HttpStatus, Catch, HttpException } from "@nestjs/common";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const req  = ctx.getRequest();
    const res = ctx.getResponse();

    if (exception.getStatus() === HttpStatus.UNAUTHORIZED) {
      if (typeof exception.response !== 'string') {
        exception.response['message'] = exception.response.message || 'You do not have permission to access this resource';
      }
    }

    res.status(exception.getStatus()).json({
      statusCode: exception.getStatus(),
      message: exception.response.message || exception.message,
      status: 'fail',
      error: exception.response.name,
      errors: exception.response.errors || null,
      timestamp: new Date().toISOString(),
      path: req ? req.url : null,
    })
  }

}