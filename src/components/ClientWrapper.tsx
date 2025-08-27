"use client";

import { Provider } from "react-redux";
import { store } from "@store/store";
import { SnackbarProvider } from "@components/Snackbars/snackbarContext";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SnackbarProvider>{children}</SnackbarProvider>
    </Provider>
  );
}
