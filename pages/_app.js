import "../styles/globals.scss";
import Head from "next/head";
import { ConfigProvider } from 'antd';


const App = ({ Component, pageProps }) => {
  return (
    <>
      <Head>
        <title>My Next.js App</title>
        <meta name="description" content="My app description" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main>
      <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#111825',
          fontFamily: 'Inter, sans-serif',
          colorTextBase: "#111825",
          colorBgLayout: "#ffffff"

        },
      }}
      >
      <Component {...pageProps} />
      </ConfigProvider>
      </main>
    </>
  );
};

export default App;
