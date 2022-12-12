import * as React from "react";
import { Table, TableProps } from "react-bootstrap";
import { IBaseProps } from "@205093/al-base-props";
import { Spinner } from "@205093/al-spinner";
import { Variants } from "@205093/al-variants";
import { useNavigate } from "react-router-dom";
import "./style.scss";

export interface IColumn<TEntity> {
  text?: string;
  headerClassName?: string;
  headerStyle?: object;
  cellClassName?: string;
  cellStyle?: object;
  isHidden?: boolean;
  key?: string;
  content?: (item: TEntity) => any;
}

export interface IProps<TEntity> extends TableProps, IBaseProps {
  columns?: IColumn<TEntity>[];
  items: TEntity[] | undefined;
  isLoading?: boolean;
  isLoadingText?: string;
  isLoadingSpinnerVariant?: Variants;
  entityBaseUrl?: string;
  noItemsText?: string | JSX.Element;
  entityKey?: string;
  rowStyle?: (value: TEntity) => object;
  rowProps?: (value: TEntity) => object;
}

export const EntityList = <TEntity extends object>({
  columns,
  items,
  isLoading,
  entityBaseUrl,
  isLoadingText,
  isLoadingSpinnerVariant,
  noItemsText,
  entityKey = "id",
  rowStyle,
  rowProps,
  ...tableProps
}: IProps<TEntity>) => {
  const getPropertyFromString = (o: TEntity, s: string): any => {
    s = s.replace(/\[(\w+)\]/g, ".$1");
    s = s.replace(/^\./, "");
    const a = s.split(".");
    for (var i = 0, n = a.length; i < n; ++i) {
      var k = a[i];
      if (k in o) {
        o = (o as any)[k];
      } else {
        return;
      }
    }
    return o;
  };

  if (columns && items && items.length > 0) {
    const item = items[0];
    for (let i = 0; i < columns.length; i++) {
      const column = columns[i];
      if (column.key && getPropertyFromString(item, column.key) === undefined)
        throw new Error(`Entity property (${column.key}) not found.`);
    }
  }

  if (items && items.length > 0 && (items[0] as any)[entityKey] === undefined)
    throw new Error(`Entity key (${entityKey}) not found.`);

  const navigate = useNavigate();
  const navigateToEntity = (baseUrl: string, id: string) => navigate(baseUrl.replace(":id", id));

  const displayAsHoverableAndStriped = items && items.length > 0 && !isLoading && !!entityBaseUrl;
  let content;
  if (isLoading)
    content = (
      <tr>
        <td className="border-0 text-center" colSpan={columns?.length ?? 1}>
          <Spinner text={isLoadingText} variant={isLoadingSpinnerVariant} />
        </td>
      </tr>
    );
  else if (!items || items.length === 0)
    content = (
      <tr className="no-result">
        <td className="border-0 text-center" colSpan={columns?.length ?? 1}>
          {noItemsText ?? "Intet resultat"}
        </td>
      </tr>
    );
  else
    content = items.map(item => (
      <tr
        onClick={
          entityBaseUrl && (item as any)[entityKey]
            ? () => navigateToEntity(entityBaseUrl, (item as any)[entityKey].toString())
            : undefined
        }
        key={(item as any)[entityKey]}
        style={rowStyle && rowStyle(item)}
        {...(rowProps && rowProps(item))}
      >
        {!columns &&
          Object.keys(item).map((key, i) => {
            const value = getPropertyFromString(item, key);
            if (["string", "number"].indexOf(typeof value) === -1) return null;

            return <td key={i}>{value}</td>;
          })}
        {columns &&
          columns.map((column, i) => {
            if (column.isHidden) return null;

            if (column.content)
              return (
                <td className={column.cellClassName} style={column.cellStyle} key={i}>
                  {column.content(item)}
                </td>
              );

            if (!column.key) return <td className={column.cellClassName} style={column.cellStyle} key={i}></td>;

            return (
              <td className={column.cellClassName} style={column.cellStyle} key={i}>
                {getPropertyFromString(item, column.key)}
              </td>
            );
          })}
      </tr>
    ));

  return (
    <Table
      {...tableProps}
      hover={tableProps.hover === true || (tableProps.hover === undefined && displayAsHoverableAndStriped)}
      striped={tableProps.striped === true || (tableProps.hover === undefined && displayAsHoverableAndStriped)}
      className={`entity-list ${tableProps.className ?? ""}`}
    >
      {columns && columns.length > 0 && (
        <thead>
          <tr>
            {columns.map((column, i) =>
              !column.isHidden ? (
                <th className={column.headerClassName} style={column.headerStyle} key={i}>
                  {column.text ?? column.key ?? ""}
                </th>
              ) : null
            )}
          </tr>
        </thead>
      )}
      <tbody>{content}</tbody>
    </Table>
  );
};
