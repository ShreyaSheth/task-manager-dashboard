"use client";

import { useRef, useEffect } from "react";
import { Provider } from "react-redux";
import { store } from "./index";
import { checkAuth } from "./slices/authSlice";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      store.dispatch(checkAuth());
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
