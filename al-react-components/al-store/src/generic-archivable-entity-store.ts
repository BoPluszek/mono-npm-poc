import { action, makeObservable, observable, runInAction } from "mobx";

import { IGenericEntityStore, IRootStore } from ".";

export interface IGenericArchivableEntityStore<
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

  isArchiving: boolean;
  archiveError: Error | undefined;
  archiveItem: (id: TKey) => Promise<TEntity>;

  isUnarchiving: boolean;
  unarchiveError: Error | undefined;
  unarchiveItem: (id: TKey) => Promise<TEntity>;
}

export class GenericArchivableEntityStore<
  TRootStore extends IRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
> implements
    IGenericArchivableEntityStore<
      TRootStore,
      TEntity,
      TCreateEntityRequest,
      TUpdateEntityRequest,
      TGetEntitiesRequest,
      TKey
    >
{
  baseStore: IGenericEntityStore<
    TRootStore,
    TEntity,
    TCreateEntityRequest,
    TUpdateEntityRequest,
    TGetEntitiesRequest,
    TKey
  >;

  isArchiving: boolean = false;
  archiveError: Error | undefined = undefined;

  isUnarchiving: boolean = false;
  unarchiveError: Error | undefined = undefined;

  constructor(
    baseStore: IGenericEntityStore<
      TRootStore,
      TEntity,
      TCreateEntityRequest,
      TUpdateEntityRequest,
      TGetEntitiesRequest,
      TKey
    >
  ) {
    makeObservable(this, {
      isArchiving: observable,
      archiveError: observable,
      isUnarchiving: observable,
      unarchiveError: observable
    });

    this.baseStore = baseStore;
  }

  archiveItem = action(async (id: TKey) => {
    this.isArchiving = true;
    this.archiveError = undefined;

    if (this.baseStore.rootStore.sleepTimeout && this.baseStore.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.baseStore.rootStore.sleepTimeout));

    return this.baseStore.rootStore.authStore.authorize((result: any) =>
      fetch(`${this.baseStore.baseUrl}/${id}/archive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + result.accessToken
        }
      }).then(
        action(async (response: Response) => {
          this.isArchiving = false;

          if (!response.ok) {
            const errorMessage = await response.text();
            runInAction(() => {
              this.archiveError = new Error(errorMessage);
            });

            setTimeout(
              () => runInAction(() => (this.unarchiveError = undefined)),
              this.baseStore.rootStore.resetErrorTimeout ?? 2000
            );

            return Promise.reject();
          } else {
            const data = await response.json();
            const item: TEntity = this.baseStore.createEntity(data) as TEntity;

            runInAction(() => {
              this.baseStore.item = item;
              this.baseStore.isUpdating = false;
            });

            this.baseStore.getItems();

            return Promise.resolve(item);
          }
        })
      )
    );
  });

  unarchiveItem = action(async (id: TKey) => {
    this.isUnarchiving = true;
    this.unarchiveError = undefined;

    if (this.baseStore.rootStore.sleepTimeout && this.baseStore.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.baseStore.rootStore.sleepTimeout));

    return this.baseStore.rootStore.authStore.authorize((result: any) =>
      fetch(`${this.baseStore.baseUrl}/${id}/unarchive`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + result.accessToken
        }
      }).then(
        action(async (response: Response) => {
          this.isUnarchiving = false;

          if (!response.ok) {
            const errorMessage = await response.text();
            runInAction(() => {
              this.unarchiveError = new Error(errorMessage);
            });

            setTimeout(
              () => runInAction(() => (this.unarchiveError = undefined)),
              this.baseStore.rootStore.resetErrorTimeout ?? 2000
            );

            return Promise.reject();
          } else {
            const data = await response.json();
            const item: TEntity = this.baseStore.createEntity(data) as TEntity;

            runInAction(() => {
              this.baseStore.item = item;
              this.baseStore.isUpdating = false;
            });

            this.baseStore.getItems();

            return Promise.resolve(item);
          }
        })
      )
    );
  });
}
