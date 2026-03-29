import * as React from "react";

// Runtime import of the real library under a different name (see vite.config alias)
// @ts-expect-error - This is resolved at runtime by Vite alias
import * as RRD from "react-router-dom-original";

// Re-export everything so other imports keep working
// @ts-expect-error - This is resolved at runtime by Vite alias
export * from "react-router-dom-original";

// Export the original Routes component without modification
export const Routes = RRD.Routes;

// Export the original HashRouter component without modification
export const HashRouter = RRD.HashRouter;

// Export the original BrowserRouter component without modification
export const BrowserRouter = RRD.BrowserRouter;

// Export the original MemoryRouter component without modification
export const MemoryRouter = RRD.MemoryRouter;