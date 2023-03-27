import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/LayoutComponent";

const About = () => {
  return (
    <Layout>
      <Head>
        <title>Pricing</title>
      </Head>

      <h1>Pricing</h1>
      <Link href="/">back to blog</Link>
    </Layout>
  );
};

export default About;
