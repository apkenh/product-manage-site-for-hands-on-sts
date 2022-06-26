import { Observable } from 'rxjs';
import { LoadingService } from 'src/app/core/services/loading.service';
import { RoutingService } from 'src/app/core/services/routing.service';
import { TitleI18Service } from 'src/app/shared/services/title-i18.service';

import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

import { UrlConst } from '../../constants/url-const';
import { SignInRequestDto } from '../../models/dtos/requests/sign-in-request-dto';
import { SignInResponseDto } from '../../models/dtos/responses/sign-in-response-dto';
import { User } from '../../models/user';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-sign-in-page',
  templateUrl: './sign-in-page.component.html',
  styleUrls: ['./sign-in-page.component.scss']
})
export class SignInPageComponent implements OnInit, AfterViewChecked {
  signInUserAccount = new FormControl('user01', [Validators.required]);
  signInUserPassword = new FormControl('demo', [Validators.required]);

  signInForm = this.formBuilder.group({
    signInUserAccount: this.signInUserAccount,
    signInUserPassword: this.signInUserPassword
  });

  constructor(private accountService: AccountService, private formBuilder: FormBuilder, private loadingService: LoadingService, private routingService: RoutingService, private titleI18Service: TitleI18Service, public translateService: TranslateService) {}

  ngOnInit(): void {
    this.setupLanguage();
  }

  ngAfterViewChecked() {
    this.titleI18Service.setTitle(UrlConst.PATH_SIGN_IN);
  }

  clickSignInButton() {
    const signInRequestDto = this.createSignInRequestDto();

    this.signIn(signInRequestDto);
  }

  private createSignInRequestDto(): SignInRequestDto {
    // Creates Request.
    return {
      Username: this.signInUserAccount.value,
      Password: this.signInUserPassword.value
    };
  }

  private getLanguage(language: string): string {
    const CHAR_HYPHEN = '-';
    if (language.indexOf(CHAR_HYPHEN) > 0) {
      const splittedLanguage: string[] = language.split(CHAR_HYPHEN);
      return splittedLanguage[0];
    }
    return language;
  }

  private setupLanguage() {
    this.translateService.setDefaultLang(this.getLanguage(navigator.language));
    this.translateService.use(this.getLanguage(navigator.language));
  }

  private setUpUserAccount(responseDto: SignInResponseDto) {
    const user: User = new User();
    user.userAccount = responseDto.userAccount;
    user.userName = responseDto.userName;
    user.userLocale = responseDto.userLocale;
    user.userLanguage = responseDto.userLanguage;
    user.userTimezone = responseDto.userTimezone;
    user.userTimezoneOffset = responseDto.userTimezoneOffset;
    user.userCurrency = responseDto.userCurrency;
    this.accountService.setUser(user);
  }

  private signIn(signInRequestDto: SignInRequestDto) {
    this.loadingService.startLoading();
    const signInResponseDto: Observable<SignInResponseDto> = this.accountService.signIn(signInRequestDto);
    signInResponseDto.subscribe((responseDto) => {
      if (responseDto != null) {
        this.setUpUserAccount(responseDto);
        this.routingService.navigate(UrlConst.PATH_PRODUCT_LISTING);
      }
      this.loadingService.stopLoading();
    });
  }
}
