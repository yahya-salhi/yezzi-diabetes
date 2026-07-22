import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { PaywallScreen } from "../screens/PaywallScreen";

type PaywallContextValue = {
  showPaywall: () => void;
};

const PaywallContext = createContext<PaywallContextValue | null>(null);

export function PaywallProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);

  const showPaywall = useCallback(() => {
    setVisible(true);
  }, []);

  const hidePaywall = useCallback(() => {
    setVisible(false);
  }, []);

  return (
    <PaywallContext.Provider value={{ showPaywall }}>
      {children}
      <PaywallScreen visible={visible} onClose={hidePaywall} />
    </PaywallContext.Provider>
  );
}

export function usePaywall(): PaywallContextValue {
  const ctx = useContext(PaywallContext);
  if (!ctx) {
    throw new Error("usePaywall must be used within a <PaywallProvider>");
  }
  return ctx;
}
