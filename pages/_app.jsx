import { useSession } from "next-auth/react"
import { SessionProvider } from "next-auth/react"
import RTL from "components/RTL";
import { AppProvider } from "contexts/AppContext";
import SettingsProvider from "contexts/SettingContext";
import Head from "next/head";
import Router from "next/router";
import nProgress from "nprogress";
import "nprogress/nprogress.css";
import { Fragment, useEffect } from "react";
import "react-quill/dist/quill.snow.css";
import "simplebar/dist/simplebar.min.css";
import MuiTheme from "theme/MuiTheme";
import OpenGraphTags from "utils/OpenGraphTags";
import "../src/fake-db";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ConfirmProvider } from "material-ui-confirm";
import { signOut } from "next-auth/react"
// import useScrollRestoration from "../src/utils/useScrollRestoration";

//Binding events.
Router.events.on("routeChangeStart", () => nProgress.start());
Router.events.on("routeChangeComplete", () => nProgress.done());
Router.events.on("routeChangeError", () => nProgress.done()); // small change

nProgress.configure({
  showSpinner: false,
});

const App = ({ router, Component, pageProps:{session, ...pageProps} }) => {

  const AnyComponent = Component;

  const getLayout = AnyComponent.getLayout ?? ((page) => page);

  useEffect(() => {
    // Remove the server-side injected CSS.
    const jssStyles = document.querySelector("#jss-server-side");

    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  }, []);
  // useScrollRestoration(router);
  return (
    <Fragment>
      <Head>
        <meta charSet="utf-8" />
        <title>Ecommerce | Online Product Store | Admin Panel</title>
        <meta name="title" content="Buy Products Online - Ecommerce" />
        <meta
          name="description"
          content="Navigate through our wide collection of School, Colleges and other Story Books. Buy Books & other items Online from largest bookstore in Islamabad. Order Now!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <OpenGraphTags />
      </Head>

      
      <SettingsProvider>
        <AppProvider>
          <MuiTheme>
          <SessionProvider 
            session={session}
            // basePath tells NextAuth where to find the API routes
            // Since NextAuth routes are at /api/auth/[...nextauth], basePath should be "/api/auth"
            basePath="/api/auth"
            // refetchInterval: 0 means NextAuth won't auto-refetch the session
            // This prevents the client from trying to fetch from wrong URLs
            refetchInterval={0}
          >
            <ConfirmProvider>
              {Component.auth ? (
                <Auth>
                  <RTL>{getLayout(<AnyComponent {...pageProps} />)
                  } <ToastContainer
                  position="top-right"
                  autoClose={5000}
                  hideProgressBar={true}
                  newestOnTop
                  closeOnClick
                  rtl={false}
                  pauseOnFocusLoss={false}
                  draggable
                  pauseOnHover
              />
              </RTL> 
                </Auth>
                ):(
                <RTL>{getLayout(<AnyComponent {...pageProps} />)}
                <ToastContainer
                    position="top-right"
                    autoClose={5000}
                    hideProgressBar={true}
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss={false}
                    draggable
                    pauseOnHover
                />
                </RTL>
                )}
            </ConfirmProvider>
          </SessionProvider>
          </MuiTheme>
        </AppProvider>
      </SettingsProvider>
      
    </Fragment>
  );
}; // Only uncomment this method if you have blocking data requirements for
// every single page in your application. This disables the ability to
// perform automatic static optimization, causing every page in your app to
// be server-side rendered.
//
// App.getInitialProps = async (appContext) => {
//   // calls page's `getInitialProps` and fills `appProps.pageProps`
//   const appProps = await App.getInitialProps(appContext);
//   return { ...appProps };
// };

function Auth({ children }) {
  // if `{ required: true }` is supplied, `status` can only be "loading" or "authenticated"
  const { data: session,status } = useSession({ required: true })

  if (status === "loading") {
    return <div>Loading...</div>
  }
  if (session && 'error' in session && session.error== "SessionTimedOut"){
    // alert('Signing out session');
    signOut({redirect: false});
    return
  }
  return children
}

export default App;
