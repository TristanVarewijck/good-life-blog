import { Breadcrumb } from "antd";
import Head from "next/head";
import { useRouter } from "next/router";
import Heading from "../components/Heading";
import LayoutComponent from "../components/LayoutComponent";
import styles from "./index.module.scss";

const PostDetail = ({ post }) => {
  const router = useRouter();
  const { pid } = router.query;
  const { attributes } = post.data[0];

  return (
    <LayoutComponent>
      <Head>
        <title>{`Service-${pid}`}</title>
      </Head>
      <Breadcrumb
        style={{ marginTop: "15px" }}
        items={[
          {
            title: <a href="/">Home</a>,
          },
          {
            title: <a href={`/${attributes.slug}`}>{attributes.title}</a>,
          },
        ]}
      />
      <Heading title={attributes.title} isCentered />

      <div className={styles.contentBox}>{attributes.content}</div>
    </LayoutComponent>
  );
};

export const getStaticPaths = async () => {
  const postRes = fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/posts`, {
    headers: {
      Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
    },
  });
  const response = await postRes;
  const json = await response.json();
  const paths = json.data.map((content, _index) => ({
    params: { pid: content.attributes.slug },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps = async ({ params }) => {
  const postRes = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?filters[slug]=${params.pid}`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
      },
    }
  );
  const response = await postRes;

  return {
    props: {
      post: await response.json(),
    },
  };
};

export default PostDetail;
