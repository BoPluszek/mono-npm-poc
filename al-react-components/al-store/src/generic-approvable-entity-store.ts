import { action, runInAction, makeObservable, observable } from "mobx";

import { IGenericEntityStore, IRootStore } from ".";

export interface IGenericApprovableEntityStore<
  TRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
> {
  baseStore: IGenericEntityStore<
    TRootStore,
    TEntity,
    TCreateEntityRequest,
    TUpdateEntityRequest,
    TGetEntitiesRequest,
    TKey
  >;

  isApproving: boolean;
  approveError: Error | undefined;
  approveItem: (id: TKey) => Promise<TEntity>;
  approveItemCallback?: () => void;

  isDismissing: boolean;
  dismissError: Error | undefined;
  dismissItem: (id: TKey) => Promise<TEntity>;
  dismissItemCallback?: () => void;
}

export class GenericApprovableEntityStore<
  TRootStore extends IRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
> implements
    IGenericApprovableEntityStore<
      TRootStore,
      TEntity,
      TCreateEntityRequest,
      TUpdateEntityRequest,
      TGetEntitiesRequest,
      TKey
    >
{
  isApproving: boolean = false;
  approveError: Error | undefined = undefined;
  approveItemCallback?: () => void;

  isDismissing: boolean = false;
  dismissError: Error | undefined = undefined;
  dismissItemCallback?: () => void;

  constructor(
    public baseStore: IGenericEntityStore<
      TRootStore,
      TEntity,
      TCreateEntityRequest,
      TUpdateEntityRequest,
      TGetEntitiesRequest,
      TKey
    >
  ) {
    makeObservable(this, {
      isApproving: observable,
      approveError: observable,
      isDismissing: observable,
      dismissError: observable
    });
  }

  approveItem = action(async (id: TKey) => {
    this.isApproving = true;
    this.approveError = undefined;

    if (this.baseStore.rootStore.sleepTimeout && this.baseStore.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.baseStore.rootStore.sleepTimeout));

    return this.baseStore.rootStore.authStore.authorize((result: any) =>
      fetch(`${this.baseStore.baseUrl}/${id}/approve`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + result.accessToken
        }
      }).then(
        action(async (response: Response) => {
          if (!response.ok) {
            const errorMessage = await response.text();
            runInAction(() => {
              this.approveError = new Error(errorMessage);
              this.isApproving = false;
            });

            setTimeout(
              () => runInAction(() => (this.approveError = undefined)),
              this.baseStore.rootStore.resetErrorTimeout ?? 2000
            );

            return Promise.reject();
          } else {
            const data = await response.json();
            const item: TEntity = this.baseStore.createEntity(data) as TEntity;

            runInAction(() => {
              this.isApproving = false;
            });

            this.baseStore.getItems();
            this.baseStore.getItem(id);

            if (this.approveItemCallback) this.approveItemCallback();

            return Promise.resolve(item);
          }
        })
      )
    );
  });

  dismissItem = action(async (id: TKey) => {
    this.isDismissing = true;
    this.dismissError = undefined;

    if (this.baseStore.rootStore.sleepTimeout && this.baseStore.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.baseStore.rootStore.sleepTimeout));

    return this.baseStore.rootStore.authStore.authorize((result: any) =>
      fetch(`${this.baseStore.baseUrl}/${id}/dismiss`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + result.accessToken
        }
      }).then(
        action(async (response: Response) => {
          if (!response.ok) {
            const errorMessage = await response.text();
            runInAction(() => {
              this.dismissError = new Error(errorMessage);
              this.isDismissing = false;
            });

            setTimeout(
              () => runInAction(() => (this.dismissError = undefined)),
              this.baseStore.rootStore.resetErrorTimeout ?? 2000
            );

            return Promise.reject();
          } else {
            const data = await response.json();
            const item: TEntity = this.baseStore.createEntity(data) as TEntity;

            runInAction(() => {
              this.isDismissing = false;
            });

            this.baseStore.getItems();
            this.baseStore.getItem(id);

            if (this.dismissItemCallback) this.dismissItemCallback();

            return Promise.resolve(item);
          }
        })
      )
    );
  });
}
