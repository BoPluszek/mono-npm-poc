import { action, makeObservable, observable, runInAction } from "mobx";

import { KeyValuePair } from "@205093/al-key-value-pair";
import { IRootStore } from ".";

export interface IGenericKeyEntityStore<TRootStore, TEntity, TCreateEntityRequest, TGetEntitiesRequest> {
  rootStore: TRootStore;

  baseUrl: string;

  createEntityKey: string;
  getEntitiesKey: string;

  isCreating: KeyValuePair<number, boolean> | undefined;
  createError: KeyValuePair<number, Error> | undefined;

  isGettingItems: boolean;
  items: TEntity[] | undefined;
  getItemsError: Error | undefined;

  createItem: (request: TCreateEntityRequest, getRequest: TGetEntitiesRequest) => Promise<TEntity>;
  getItems: (request: TGetEntitiesRequest) => Promise<TEntity[]>;
}

export class GenericKeyEntityStore<TRootStore extends IRootStore, TEntity, TCreateEntityRequest, TGetEntitiesRequest>
  implements IGenericKeyEntityStore<TRootStore, TEntity, TCreateEntityRequest, TGetEntitiesRequest>
{
  rootStore: TRootStore;

  baseUrl: string;
  ent: new (item: any) => TEntity;

  createEntityKey: string;
  getEntitiesKey: string;

  isCreating: KeyValuePair<number, boolean> | undefined = undefined;
  createError: KeyValuePair<number, Error> | undefined = undefined;

  isGettingItems: boolean = false;
  items: TEntity[] | undefined = undefined;
  getItemsError: Error | undefined = undefined;

  createEntity(item: any): TEntity {
    return new this.ent(item);
  }

  constructor(
    rootStore: TRootStore,
    entityUrl: string,
    type: new (item: TEntity) => TEntity,
    createEntityKey: string,
    getEntitiesKey: string
  ) {
    makeObservable(this, {
      rootStore: false,
      baseUrl: false,
      createEntityKey: false,
      getEntitiesKey: false,
      ent: false,
      isCreating: observable,
      createError: observable,
      isGettingItems: observable,
      items: observable,
      getItemsError: observable
    });
    this.rootStore = rootStore;
    this.baseUrl = `${this.rootStore.appSettings.REACT_APP_API_URL}/${entityUrl}`;
    this.ent = type;
    this.createEntityKey = createEntityKey;
    this.getEntitiesKey = getEntitiesKey;
  }

  createItem = action(async (request: TCreateEntityRequest, getRequest: TGetEntitiesRequest) => {
    this.isCreating = new KeyValuePair<number, boolean>((request as any)[this.createEntityKey], true);
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
              this.createError = new KeyValuePair<number, Error>(
                (request as any)[this.createEntityKey],
                new Error(errorMessage)
              );
              this.isCreating = new KeyValuePair<number, boolean>((request as any)[this.createEntityKey], false);
            });

            setTimeout(
              () => runInAction(() => (this.createError = undefined)),
              this.rootStore.resetErrorTimeout ?? 2000
            );

            return Promise.reject();
          } else {
            this.getItems(getRequest);

            var createdItem: TEntity = await response.json();

            runInAction(() => {
              this.isCreating = new KeyValuePair<number, boolean>((request as any)[this.createEntityKey], false);
            });

            return Promise.resolve(createdItem);
          }
        })
      )
    );
  });

  getItems = action(async (request: TGetEntitiesRequest) => {
    this.isGettingItems = true;
    this.getItemsError = undefined;

    if (this.rootStore.sleepTimeout && this.rootStore.sleepTimeout > 0)
      await new Promise(resolve => setTimeout(resolve, this.rootStore.sleepTimeout));

    return this.rootStore.authStore.authorize((result: any) =>
      fetch(`${this.baseUrl}/${(request as any)[this.getEntitiesKey]}`, {
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

            setTimeout(
              () => runInAction(() => (this.createError = undefined)),
              this.rootStore.resetErrorTimeout ?? 2000
            );

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
      )
    );
  });
}
