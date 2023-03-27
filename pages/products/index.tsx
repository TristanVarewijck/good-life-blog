import Head from "next/head";
import Layout from "../../components/LayoutComponent";
import Heading from "../../components/Heading";

const Products = () => {
  return (
    <Layout>
      <Head>
        <title>Services</title>
      </Head>
    </Layout>
  );
};

// export const getStaticProps = async () => {
//   const servicesRes = fetch(
//     `http://localhost:${process.env.CMS_PORT}/api/services?populate=*`
//   );
//   const response = await servicesRes;

//   return {
//     props: {
//       services: await response.json(),
//     },
//   };
// };

export default Products;
