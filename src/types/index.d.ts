
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
  orderBy?: string;
  type?: string;
  limit?: number;
} & KeyValue


declare module "@splidejs/react-splide" {
  import { ReactNode } from "react"

  // Define a generic component type.
  export type SplideComponent<T = any> = React.ComponentType<T>

  export type SplideComponent<T = any> = React.ComponentType<T>

  // Define the SplideProps interface.
  export interface SplideProps {
    options?: SplideOptions
    hasSliderWrapper?: boolean
    children?: ReactNode
    [key: string]: any // Allow any other props
  }

  // Define the SplideSlideProps interface.
  export interface SplideSlideProps {
    children?: ReactNode
    [key: string]: any // Allow any other props
  }

  // Define the SplideOptions interface (you should adjust this according to your needs).
  export interface SplideOptions {
    // Add the options you want to use.
    perPage?: number
    gap?: string | number
    [key: string]: any
  }

  // Export the Splide and SplideSlide components.
  export const Splide: SplideComponent<SplideProps>
  export const SplideTrack: SplideComponent<SplideProps>
  export const SplideSlide: SplideComponent<SplideSlideProps>
}

type TawkMessengerReactProps = {
  propertyId: string;
  customStyle?: any;
  widgetId: string;
  onLoad?: () => void;
}



 type Market = "NSE" | "Crypto" | "US Stocks"
 type BetDirection = "up" | "down"
 type BetType = "single-digit" | "double-digit"


declare module '@tawk.to/tawk-messenger-react' {

  export type TawkMessengerReactComponent<T = any> = React.ComponentType<T>

  const TawkMessengerReact: TawkMessengerReactComponent<TawkMessengerReactProps>;
  export default TawkMessengerReact;
}
