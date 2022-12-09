export type IRootStore = import("./root-store").IRootStore;

export { AuthStore } from "./auth-store";

export { GenericEntityStore } from "./generic-entity-store";
export type IGenericEntityStore<
  TRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
> = import("./generic-entity-store").IGenericEntityStore<
  TRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
>;

export { GenericKeyEntityStore } from "./generic-key-entity-store";
export type IGenericKeyEntityStore<TRootStore, TEntity, TCreateEntityRequest, TUpdateEntityRequest> =
  import("./generic-key-entity-store").IGenericKeyEntityStore<
    TRootStore,
    TEntity,
    TCreateEntityRequest,
    TUpdateEntityRequest
  >;

export { GenericArchivableEntityStore } from "./generic-archivable-entity-store";
export type IGenericArchivableEntityStore<
  TRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
> = import("./generic-archivable-entity-store").IGenericArchivableEntityStore<
  TRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
>;

export { GenericApprovableEntityStore } from "./generic-approvable-entity-store";
export type IGenericApprovableEntityStore<
  TRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
> = import("./generic-approvable-entity-store").IGenericApprovableEntityStore<
  TRootStore,
  TEntity,
  TCreateEntityRequest,
  TUpdateEntityRequest,
  TGetEntitiesRequest,
  TKey
>;
