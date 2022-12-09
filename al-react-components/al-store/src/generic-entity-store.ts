import { action, makeObservable, observable, runInAction } from "mobx";
import { stringify } from "query-string";

import { IRootStore } from ".";

export interface IGenericEntityStore<
  TRootStore extends IRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
> {
  rootStore: TRootStore;
  baseUrl: string;
  createEntity: (item: any) => TEntity;

  isCreating: boolean;
  createError: Error | undefined;

  isGettingItems: boolean;
  items: TEntity[] | undefined;
  getItemsError: Error | undefined;

  isGettingItem: boolean;
  item: TEntity | undefined;
  getItemError: Error | undefined;

  isUpdating: boolean;
  updateError: Error | undefined;

  isRemoving: boolean;
  removeError: Error | undefined;

  createItem: (request: TCreateEntityRequest) => Promise<TEntity>;
  getItems: (request?: TGetEntitiesRequest) => Promise<TEntity[]>;
  getItem: (id: TKey) => Promise<TEntity>;
  updateItem: (id: TKey, request: TUpdateEntityRequest) => Promise<TEntity>;
  deleteItem: (id: TKey) => Promise<void>;
}

export class GenericEntityStore<
  TRootStore extends IRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
> implements
    IGenericEntityStore<TRootStore, TEntity, TCreateEntityRequest, TUpdateEntityRequest, TGetEntitiesRequest, TKey>
{
  rootStore: TRootStore;

  baseUrl: string;
  entity: new (item: any) => TEntity;

  isCreating: boolean = false;
  createError: Error | undefined = undefined;

  isGettingItems: boolean = false;
  items: TEntity[] | undefined = undefined;
  getItemsError: Error | undefined = undefined;

  isGettingItem: boolean = false;
  item: TEntity | undefined = undefined;
  getItemError: Error | undefined = undefined;

  isUpdating: boolean = false;
  updateError: Error | undefined = undefined;

  isRemoving: boolean = false;
  removeError: Error | undefined = undefined;

  createEntity(item: any): TEntity {
    return new this.entity(item);
  }

  constructor(rootStore: TRootStore, entityUrl: string, entity: new (item: TEntity) => TEntity) {
    this.rootStore = rootStore;
    this.baseUrl = `${this.rootStore.appSettings.REACT_APP_API_URL}/${entityUrl}`;
    this.entity = entity;

    makeObservable(this, {
      rootStore: false,
      baseUrl: false,
      isCreating: observable,
      createError: observable,
      isGettingItems: observable,
      items: observable,
      getItemsError: observable,
      isGettingItem: observable,
      item: observable,
      getItemError: observable,
      isUpdating: observable,
      updateError: observable,
      isRemoving: observable,
      removeError: observable
    });
  }

  createItem = action(async (request: TCreateEntityRequest) => {
    this.isCreating = true;
    this.createError = undefined;

    if (this.rootStore.sleepTimeout && this.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.rootStore.sleepTimeout));

    return this.rootStore.authStore.authorize((result: any) =>
      fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + result.accessToken
        },
        body: JSON.stringify(request)
      }).then(
        action(async (response: Response) => {
          if (!response.ok) {
            const errorMessage = await response.text();
            runInAction(() => {
              this.createError = new Error(errorMessage);
              this.isCreating = false;
            });

            setTimeout(
              () => runInAction(() => (this.createError = undefined)),
              this.rootStore.resetErrorTimeout ?? 2000
            );

            return Promise.reject();
          } else {
            if (this.items) this.getItems();

            var createdItem: TEntity = await response.json();

            runInAction(() => {
              this.isCreating = false;
            });

            return Promise.resolve(createdItem);
          }
        })
      )
    );
  });

  getItems = action(async (request?: TGetEntitiesRequest) => {
    this.isGettingItems = true;
    this.getItemsError = undefined;

    if (this.rootStore.sleepTimeout && this.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.rootStore.sleepTimeout));

    return this.rootStore.authStore.authorize((result: any) => {
      let url = this.baseUrl;
      if (request !== undefined) {
        var parameters = stringify(request as any);
        url += `?${parameters}`;
      }
      return fetch(url, {
        headers: {
          Authorization: "Bearer " + result.accessToken
        }
      }).then(
        action(async (response: Response) => {
          if (!response.ok) {
            const errorMessage = await response.text();
            runInAction(() => {
              this.getItemsError = new Error(errorMessage);
              this.isGettingItems = false;
            });

            return Promise.reject();
          } else {
            const data = await response.json();
            const items: TEntity[] = data.map((item: any) => this.createEntity(item));

            runInAction(() => {
              this.items = items;
              this.isGettingItems = false;
            });

            return Promise.resolve(items);
          }
        })
      );
    });
  });

  getItem = action(async (id: TKey) => {
    this.isGettingItem = true;
    this.getItemError = undefined;

    if (this.rootStore.sleepTimeout && this.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.rootStore.sleepTimeout));

    return this.rootStore.authStore.authorize((result: any) =>
      fetch(`${this.baseUrl}/${id}`, {
        headers: {
          Authorization: "Bearer " + result.accessToken
        }
      }).then(
        action(async (response: Response) => {
          if (!response.ok) {
            const errorMessage = await response.text();
            runInAction(() => {
              this.getItemError = new Error(errorMessage);
              this.isGettingItem = false;
            });

            return Promise.reject();
          } else {
            const data = await response.json();
            const item: TEntity = this.createEntity(data) as TEntity;

            runInAction(() => {
              this.item = item;
              this.isGettingItem = false;
            });

            return Promise.resolve(item);
          }
        })
      )
    );
  });

  updateItem = action(async (id: TKey, request: TUpdateEntityRequest) => {
    this.isUpdating = true;
    this.updateError = undefined;

    if (this.rootStore.sleepTimeout && this.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.rootStore.sleepTimeout));

    return this.rootStore.authStore.authorize((result: any) =>
      fetch(`${this.baseUrl}/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + result.accessToken
        },
        body: JSON.stringify(request)
      }).then(
        action(async (response: Response) => {
          if (!response.ok) {
            const errorMessage = await response.text();
            runInAction(() => {
              this.updateError = new Error(errorMessage);
              this.isUpdating = false;
            });

            setTimeout(
              () => runInAction(() => (this.updateError = undefined)),
              this.rootStore.resetErrorTimeout ?? 2000
            );

            return Promise.reject();
          } else {
            const data = await response.json();
            const item: TEntity = this.createEntity(data) as TEntity;

            runInAction(() => {
              this.item = item;
              this.isUpdating = false;
            });

            return Promise.resolve(item);
          }
        })
      )
    );
  });

  deleteItem = action(async (id: TKey) => {
    this.isRemoving = true;
    this.removeError = undefined;

    if (this.rootStore.sleepTimeout && this.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.rootStore.sleepTimeout));

    return this.rootStore.authStore.authorize((result: any) =>
      fetch(`${this.baseUrl}/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + result.accessToken
        }
      }).then(
        action(async (response: Response) => {
          if (!response.ok) {
            const errorMessage = await response.text();
            runInAction(() => {
              this.removeError = new Error(errorMessage);
              this.isRemoving = false;
            });

            setTimeout(
              () => runInAction(() => (this.removeError = undefined)),
              this.rootStore.resetErrorTimeout ?? 2000
            );

            return Promise.reject();
          } else {
            runInAction(() => {
              this.isRemoving = false;
            });

            if (this.items) this.getItems();

            return Promise.resolve();
          }
        })
      )
    );
  });
}
