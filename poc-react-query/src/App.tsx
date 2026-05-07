import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import PaginationExample from "./components/PaginationExample";
import { SWRBasicDemo } from "./components/SWRBasicDemo";
import { SWRConfigDemo } from "./components/SWRConfigDemo";
import { SWRMutationDemo } from "./components/SWRMutationDemo";
import { TableBasic } from "./components/TableBasic";
import { TableWithFilter } from "./components/TableWithFilter";
import { TableWithPagination } from "./components/TableWithPagination";
import { TableWithSelection } from "./components/TableWithSelection";
import { VirtualList } from "./components/VirtualList";
import { VirtualComparison } from "./components/VirtualComparison";
import { QueryBasic } from "./components/QueryBasic";
import { QueryMutation } from "./components/QueryMutation";
import { QueryOptimistic } from "./components/QueryOptimistic";
import { QueryInfinite } from "./components/QueryInfinite";
import { QueryDependent } from "./components/QueryDependent";
import { QueryCacheConfig } from "./components/QueryCacheConfig";
import { QueryPrefetch } from "./components/QueryPrefetch";
import { QueryDevtools } from "./components/QueryDevtools";
import { VirtualGrid } from "./components/VirtualGrid";
import { InfiniteVirtualList } from "./components/InfiniteVirtualList";
import { FormBasic } from "./components/FormBasic";
import { FormAsync } from "./components/FormAsync";
import { QueryParallel } from "./components/QueryParallel";

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: true } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TableBasic />
      <TableWithFilter />
      <TableWithPagination />
      <TableWithSelection />
      <VirtualList />
      <VirtualComparison />
      <PaginationExample />
      <SWRBasicDemo />
      <SWRConfigDemo />
      <SWRMutationDemo />
      <QueryBasic />
      <QueryMutation />
      <QueryOptimistic />
      <QueryInfinite />
      <QueryDependent />
      <QueryCacheConfig />
      <QueryPrefetch />
      <QueryDevtools />
      <VirtualGrid />
      <InfiniteVirtualList />
      <FormBasic />
      <FormAsync />
      <QueryParallel />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
