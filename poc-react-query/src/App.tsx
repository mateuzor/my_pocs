import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PaginationExample from "./components/PaginationExample";
import { SWRBasicDemo } from "./components/SWRBasicDemo";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: true,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <PaginationExample />
      <SWRBasicDemo />
    </QueryClientProvider>
  );
}
