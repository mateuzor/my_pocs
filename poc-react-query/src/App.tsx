import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginationExample from "./components/PaginationExample";
import { SWRBasicDemo } from "./components/SWRBasicDemo";
import { SWRConfigDemo } from "./components/SWRConfigDemo";
import { SWRMutationDemo } from "./components/SWRMutationDemo";
import { TableBasic } from "./components/TableBasic";
import { TableWithFilter } from "./components/TableWithFilter";
import { TableWithPagination } from "./components/TableWithPagination";
import { TableWithSelection } from "./components/TableWithSelection";
import { VirtualList } from "./components/VirtualList";

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
      <PaginationExample />
      <SWRBasicDemo />
      <SWRConfigDemo />
      <SWRMutationDemo />
    </QueryClientProvider>
  );
}
