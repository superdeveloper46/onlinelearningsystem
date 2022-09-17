import React from "react";
import { useSelector } from "react-redux";

import OlsLoader from "./loader/ols/index.jsx";
import AuthRoutes from "./AuthRoutes.jsx";

const AuthenticatedRoutes = React.lazy(() =>
  import("./AuthenticatedRoutes.jsx")
);
const AdminRoutes = React.lazy(() => import("./AdminRoutes"));

function Router() {
  const authenticated = useSelector((store) => store.auth.authenticated);
  const isAdmin = useSelector((store) => store.auth.Admin.IsAdmin);
  // const isAdmin = false;

  return ( 
    <React.Suspense fallback={<OlsLoader></OlsLoader>}>
      {!authenticated && <AuthRoutes></AuthRoutes>}
      {authenticated && !isAdmin && <AuthenticatedRoutes></AuthenticatedRoutes>}
      {authenticated && isAdmin && <AdminRoutes></AdminRoutes>}
    </React.Suspense>
  );
}

export default Router;
