import React, { createContext, useContext, useEffect, useState } from "react";
import { initializeDatabase } from "../data/goals-service";
import { SplashScreen } from "expo-router";

const DatabaseReadyContext = createContext(false);

export function useDatabaseReady() {
  return useContext(DatabaseReadyContext);
}

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await initializeDatabase();

        setReady(true);

        await SplashScreen.hideAsync();
      } catch (error) {
        console.error('Failed to initialize database:', error);

        setReady(true);

        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, []);

  if (!ready) return null;

  return (
    <DatabaseReadyContext.Provider value={ready}>
      {children}
    </DatabaseReadyContext.Provider>
  );
}
