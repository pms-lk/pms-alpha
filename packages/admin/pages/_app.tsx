import MyApp from "@pms-alpha/common/pages/_app";
import MetaContext from "@pms-alpha/common/contexts/meta-context";

import type { AppProps } from "next/app";

const App = ({ Component, pageProps }: AppProps) => {
  const routes: { label: string; route: string }[] = [
    { label: "Dashboard", route: "/" },
    { label: "Diagnosis types", route: "/diagnosis" },
  ];

  return (
    <MetaContext.Provider value={{ instance: "admin", routes }}>
      <MyApp pageProps={pageProps} Component={Component} />
    </MetaContext.Provider>
  );
};

export default App;
