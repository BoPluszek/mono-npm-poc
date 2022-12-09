export interface IKeyValuePairProps<TKey, TValue> {
  key: TKey;
  value: TValue;
}

export class KeyValuePair<TKey, TValue> {
  key: TKey;
  value: TValue;

  constructor(key: TKey, value: TValue) {
    this.key = key;
    this.value = value;
  }
}
