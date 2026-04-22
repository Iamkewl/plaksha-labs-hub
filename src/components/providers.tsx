"use client";

import {
  DataThemeProvider,
  IconProvider,
  LayoutProvider,
  ThemeProvider,
  ToastProvider,
} from "@once-ui-system/core";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { useState, type ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <ThemeProvider
      theme="dark"
      brand="blue"
      accent="indigo"
      neutral="gray"
      solid="contrast"
      solidStyle="flat"
      border="playful"
      surface="filled"
      transition="all"
      scaling="100"
    >
      <LayoutProvider>
        <DataThemeProvider>
          <ToastProvider>
            <IconProvider>
              <SessionProvider>
                <QueryClientProvider client={queryClient}>
                  {children}
                </QueryClientProvider>
              </SessionProvider>
            </IconProvider>
          </ToastProvider>
        </DataThemeProvider>
      </LayoutProvider>
    </ThemeProvider>
  );
}
