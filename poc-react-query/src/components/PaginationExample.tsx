import React from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import useDogs from "../hooks/useDogs";

function PaginationExample() {
  const [page, setPage] = React.useState(0);
  const { data, error, isFetching, isPreviousData, status } = useDogs(page);

  return (
    <div>
      {status === "loading" ? (
        <div>Loading...</div>
      ) : status === "error" ? (
        <div>Error: {error?.message}</div>
      ) : (
        <div>
          {data?.data?.map((breed) => (
            <img
              key={breed.id}
              src={breed.image.url}
              alt={breed.name}
              height={100}
            />
          ))}
        </div>
      )}
      <div>Current Page: {page}</div>
      <button
        onClick={() => setPage((old) => Math.max(old - 1, 0))}
        disabled={page === 0}
      >
        Previous Page
      </button>{" "}
      <button
        onClick={() => {
          setPage((old) => (data?.hasMore ? old + 1 : old));
        }}
        disabled={isPreviousData || !data?.hasMore}
      >
        Next Page
      </button>
      {isFetching ? <span> Loading...</span> : null}{" "}
      <ReactQueryDevtools initialIsOpen />
    </div>
  );
}

export default PaginationExample;
