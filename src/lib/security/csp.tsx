import { createContext, type ReactNode, useContext } from "react";

const CspNonceContext = createContext<string | undefined>(undefined);

export const CspNonceProvider = ({
  nonce,
  children,
}: {
  nonce?: string;
  children: ReactNode;
}) => (
  <CspNonceContext.Provider value={nonce}>
    {children}
  </CspNonceContext.Provider>
);

export const useCspNonce = () => useContext(CspNonceContext);
