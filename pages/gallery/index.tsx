import { Col, Row } from "antd";
import Head from "next/head";
import Link from "next/link";
import Layout from "../../components/LayoutComponent";

const Gallery = () => {
  return (
    <Layout>
      <Head>
        <title>Pricing</title>
      </Head>

      <h1>Pricing</h1>
      <Link href="/">back to blog</Link>

      <Row gutter={[16, 16]}>
        {/* {images.map((image, index) => (
          <Col key={index} xs={24} sm={12} md={8} lg={6}>
            <img src={image} alt="Gallery" style={{ width: "100%" }} />
          </Col>
        ))} */}
      </Row>
    </Layout>
  );
};

export const getStaticProps = async () => {};

export default Gallery;
