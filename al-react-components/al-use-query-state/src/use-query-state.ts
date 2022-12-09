import qs from "qs";
import { useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export enum ValueType {
  boolean,
  number,
  string
}

export const useQueryState = <T extends string | number | boolean>(
  queryStringKey: string,
  type: ValueType,
  initialState?: T
): [T, any] => {
  const navigate = useNavigate();
  const location = useLocation();

  const windowKey = location.pathname + "|" + queryStringKey;
  const queryValue = qs.parse(location.search, { ignoreQueryPrefix: true })[queryStringKey]?.toString();
  const windowValue = (window as any)[windowKey];

  if (!window.hasOwnProperty(windowKey)) {
    // console.log("setting initialState", windowKey, queryValue, initialState);
    (window as any)[windowKey] = queryValue ?? initialState;
  }

  const updateUrl = (value: string) => {
    const existingQueries = qs.parse(location.search, {
      ignoreQueryPrefix: true
    });
    const queryString = qs.stringify({ ...existingQueries, [queryStringKey]: value }, { skipNulls: true });

    setTimeout(() => navigate(`${location.pathname}?${queryString}`), 0);
  };

  const setQuery = useCallback(
    (value: string) => {
      updateUrl(value);
      (window as any)[windowKey] = value;
    },
    [updateUrl, windowKey]
  );

  const get = () => {
    if (!queryValue && windowValue) {
      // console.log("update querystring value", queryValue, windowValue);
      updateUrl(windowValue);
    }

    switch (type) {
      case ValueType.string:
        return queryValue ?? windowValue;
      case ValueType.boolean:
        return (queryValue ?? windowValue) === "true";
      case ValueType.number:
        return Number.parseInt(queryValue ?? windowValue);
      default:
        throw "Unknown ValueType: " + type;
    }
  };

  return [get(), setQuery];
};
