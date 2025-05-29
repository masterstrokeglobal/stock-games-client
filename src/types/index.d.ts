
type PropsWithClassName = {
  className?: string;
};

type PaginationData = {
  limit: number;
  offset: number;
  sortOn?: string | null;
  sortBy?: "ASC" | "DESC" | null;
  search?: string | null;
  totalRecords?: number | null;
}

type SelectOption = { value: string; label: string }

type KeyValue = {
  [key: string]: string | number | boolean | undefined;
}

type SearchFilters = {
  page: number;
  active?: string;
  status?: string;
  placementAllowed?: string;
  companyId?: string;
  search: string;
  orderByField?: string;
  status?: string;
  orderBy?: string;
  type?: string;
  limit?: number;
} & KeyValue


type TawkMessengerReactProps = {
  propertyId: string;
  customStyle?: any;
  widgetId: string;
  onLoad?: () => void;
}

declare module '@tawk.to/tawk-messenger-react' {

  export type TawkMessengerReactComponent<T = any> = React.ComponentType<T>

  const TawkMessengerReact: TawkMessengerReactComponent<TawkMessengerReactProps>;
  export default TawkMessengerReact;
}