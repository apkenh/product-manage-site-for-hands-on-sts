import { catchError, map, Observable, of } from 'rxjs';
import { ErrorMessagingService } from 'src/app/core/services/error-messaging.service';
import { SessionStorageService } from 'src/app/core/services/session-storage.service';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { ApiConst } from '../constants/api-const';
import { AppConst } from '../constants/app-const';
import { SignInRequestDto } from '../models/dtos/requests/sign-in-request-dto';
import { MenuListResponseDto } from '../models/dtos/responses/menu-list-response-dto';
import { SignInResponseDto } from '../models/dtos/responses/sign-in-response-dto';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  constructor(private errorMessageService: ErrorMessagingService, private http: HttpClient) {}

  getAvailablePages(): Observable<string[]> {
    const webApiUrl = ApiConst.PATH_API_ROOT + ApiConst.PATH_AVAILABLE_PAGES;

    return this.http.get<string[]>(webApiUrl).pipe(
      catchError((error) => {
        this.errorMessageService.setupPageErrorMessageFromResponse(error);
        return of(null as string[]);
      })
    );
  }

  getMenu(): Observable<MenuListResponseDto[]> {
    const webApiUrl = ApiConst.PATH_API_ROOT + ApiConst.PATH_MENU;

    return this.http.get<MenuListResponseDto[]>(webApiUrl).pipe(
      catchError((error) => {
        this.errorMessageService.setupPageErrorMessageFromResponse(error);
        return of(null as MenuListResponseDto[]);
      })
    );
  }

  getUser(): User {
    return SessionStorageService.getItem(AppConst.STORAGE_KEY_USER, new User());
  }

  removeUser(): void {
    SessionStorageService.removeItem(AppConst.STORAGE_KEY_USER);
  }

  setUser(user: User): void {
    SessionStorageService.setItem(AppConst.STORAGE_KEY_USER, user);
  }

  signIn(signInRequestDto: SignInRequestDto): Observable<SignInResponseDto> {
    const webApiUrl = ApiConst.PATH_API_ROOT + ApiConst.PATH_SIGN_IN;
    const headers = new HttpHeaders({
      authorization: 'Basic ' + btoa(signInRequestDto.Username + ':' + signInRequestDto.Password)
    });

    return this.http.post<SignInResponseDto>(webApiUrl, signInRequestDto, { headers }).pipe(
      catchError((error) => {
        this.errorMessageService.setupPageErrorMessageFromResponse(error);
        return of(null as SignInResponseDto);
      })
    );
  }

  signOut(): Observable<void> {
    const webApiUrl = ApiConst.PATH_API_ROOT + ApiConst.PATH_SIGN_OUT;
    return this.http.post(webApiUrl, {}).pipe(
      map((res) => {
        this.removeUser();
        return;
      })
    );
  }
}
