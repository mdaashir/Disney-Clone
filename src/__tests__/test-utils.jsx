import React from "react";
import PropTypes from "prop-types";
import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/contexts/AuthContext";
import { WatchlistProvider } from "@/contexts/WatchlistContext";
import { SearchProvider } from "@/contexts/SearchContext";
import { NotificationProvider } from "@/Components/notifications/NotificationSystem";

/* eslint-disable react-refresh/only-export-components */

// Create a test query client with default options that don't retry
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0, // Updated from cacheTime to gcTime
      },
      mutations: {
        retry: false,
      },
    },
  });

const AllTheProviders = ({
  children,
  queryClient = createTestQueryClient(),
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <NotificationProvider>
            <SearchProvider>
              <WatchlistProvider>{children}</WatchlistProvider>
            </SearchProvider>
          </NotificationProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

AllTheProviders.propTypes = {
  children: PropTypes.node.isRequired,
  queryClient: PropTypes.object,
};

const customRender = (ui, options = {}) => {
  const { queryClient, ...renderOptions } = options;

  const Wrapper = ({ children }) => (
    <AllTheProviders queryClient={queryClient}>{children}</AllTheProviders>
  );

  Wrapper.propTypes = {
    children: PropTypes.node.isRequired,
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from "@testing-library/react";

// Override render method
export { customRender as render };
export { createTestQueryClient };
