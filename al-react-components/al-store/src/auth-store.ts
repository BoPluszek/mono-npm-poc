import { AuthenticationResult, IPublicClientApplication } from "@azure/msal-browser";
import { action, makeAutoObservable, runInAction } from "mobx";
import { IRootStore } from ".";

interface IProps<TRootStore extends IRootStore> {
  rootStore: TRootStore;
  msalInstance: IPublicClientApplication;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | undefined;
  item: any;
  baseUrl: string;
}

export class AuthStore<TRootStore extends IRootStore> implements IProps<TRootStore> {
  msalInstance: IPublicClientApplication;
  isAuthenticated: boolean = false;
  isLoading: boolean = false;
  error: Error | undefined = undefined;
  item: any = undefined;
  baseUrl: string;

  constructor(public rootStore: TRootStore, msalInstance: IPublicClientApplication) {
    makeAutoObservable(this, { rootStore: false });

    this.msalInstance = msalInstance;
    this.baseUrl = `${this.rootStore.appSettings.REACT_APP_APIM_URL}/user`;
  }

  login = async () => {
    try {
      await this.msalInstance.loginRedirect();
    } catch (error) {
      // TODO: Log error
    }
  };

  getToken = (scopes?: string[]) => {
    const tokenRequest = {
      account: this.msalInstance.getAllAccounts()[0],
      scopes: scopes || [
        `api://${this.rootStore.appSettings.REACT_APP_API_CLIENT_ID}/${this.rootStore.appSettings.REACT_APP_API_SCOPE}`
      ]
    };
    return new Promise<AuthenticationResult>(async (resolve, reject) => {
      try {
        if (this.msalInstance.getAllAccounts().length === 0) throw new Error("NOT_LOGGED_IN");

        const result = await this.msalInstance.acquireTokenSilent(tokenRequest);
        resolve(result);
      } catch (error) {
        return this.msalInstance.acquireTokenRedirect(tokenRequest);
      }
    });
  };

  authorize = async <T>(fn: (result: AuthenticationResult) => Promise<T>, scopes?: string[]) => {
    try {
      const token = await this.getToken(scopes);
      return fn(token);
    }
    catch (ex) {
      console.log("Authorize getToken failed", ex);
      throw ex;
    }
  };

  getIsAuthenticated = () => this.isAuthenticated || this.msalInstance.getAllAccounts().length > 0;

  getIsLoading = () => {
    let _isLoading = false;
    for (let index = 0; index < Object.keys(sessionStorage).length; index++) {
      const element = Object.keys(sessionStorage)[index];
      if (element.match(/interaction.status/g) && sessionStorage.getItem(element) === "interaction_in_progress")
        _isLoading = true;
    }
    return _isLoading;
  };

  getUser = () => {
    return this.authorize(
      result =>
        fetch(`${this.baseUrl}/me`, {
          headers: {
            Authorization: "Bearer " + result.accessToken
          }
        }).then(
          action(async (response: Response) => {
            this.isLoading = false;

            if (!response.ok) {
              const errorMessage = await response.text();
              runInAction(() => {
                this.error = new Error(errorMessage);
              });

              return Promise.reject();
            } else {
              const data = await response.json();
              runInAction(() => {
                this.item = data;
              });
              return Promise.resolve(data);
            }
          })
        ),
      this.rootStore.appSettings.REACT_APP_IDENTITY_API_SCOPE
        ? [this.rootStore.appSettings.REACT_APP_IDENTITY_API_SCOPE]
        : undefined
    );
  };
}
