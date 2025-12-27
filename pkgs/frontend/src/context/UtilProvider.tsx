import React, { createContext, useState } from "react";

export const UtilContext = createContext<any>({});

/**
 * 共通で使う変数やメソッドを定義するProvider
 * @param param0 
 * @returns 
 */
export default function UtilProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState<boolean>(false);

 
  // 状態と関数をオブジェクトにラップして、プロバイダーに引き渡す
  const global = {
    loading,
    setLoading,
  }

  return (
    <UtilContext.Provider value={global}>{children}</UtilContext.Provider>
  );
}
