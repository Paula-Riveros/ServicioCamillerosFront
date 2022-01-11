import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HTTP_INTERCEPTORS } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { TokenService } from '../service/token.service';
import { catchError, concatMap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { JwtDTO } from '../components/models/jwt-dto';
import { AuthService } from '../service/auth.service';

const AUTHORIZATION = 'Authorization';

@Injectable({
  providedIn: 'root'
})
export class ProdInterceptorService implements HttpInterceptor {

  constructor(private tokenService: TokenService, private authService: AuthService, private toastr: ToastrService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    //  let intReq = req;
    //  const token = this.tokenService.getToken();
    //  if (token != null) {

    //    intReq = req.clone({ headers: req.headers.set('Authorization', 'Bearer' + token) })
    //  }
    //  return next.handle(intReq);

      if (!this.tokenService.isLogged()) {
        return next.handle(req);
      }

      let intReq = req;
      const token = this.tokenService.getToken();

  
      intReq = this.addToken(req, token);
     

      return next.handle(intReq).pipe(catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          //  this.tokenService.getUserName(), this.tokenService.getAuthorities(), this.tokenService.getCambioClave()
          const dto: JwtDTO = new JwtDTO(this.tokenService.getToken());
          return this.authService.refresh(dto).pipe(concatMap((data: any) => {
            console.log('refreshing...');
            this.tokenService.setToken(data.token);
            intReq = this.addToken(req, data.token);
            return next.handle(intReq);
          }));
        } else {
          this.tokenService.logOut();
          return throwError(err);
        }

      }));
    }

    private addToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
      return req.clone(({headers: req.headers.set(AUTHORIZATION, 'Bearer ' + token)}))
    }
}


export const interceptorProvider = [{ provide: HTTP_INTERCEPTORS, useClass: ProdInterceptorService, multi: true }];