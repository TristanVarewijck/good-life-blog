import { Avatar, Breadcrumb, Tag } from "antd";
import Head from "next/head";
import Heading from "../components/Heading";
import LayoutComponent from "../components/LayoutComponent";
import styles from "./index.module.scss";
import { getDateFormatCreatedAt } from "../components/Utils/parseDate";
import { getAverageReadingTime } from "../components/Utils/readingTime";
import Image from "next/image";
import { RadarChartOutlined, EyeOutlined } from "@ant-design/icons";
import Link from "next/link";

const PostDetail = ({ post }) => {
  const { attributes } = post.data[0];
  const publishDate = getDateFormatCreatedAt(attributes.createdAt);
  const coverUrl = attributes.cover.data.attributes.url;
  const coverAlt = attributes.cover.data.attributes.name;
  const category = attributes.category.data.attributes.name;

  return (
    <LayoutComponent>
      <Head>
        <title>{attributes.title}</title>
      </Head>
      <Breadcrumb
        style={{ marginTop: "15px" }}
        items={[
          {
            title: <Link href="/">Guide</Link>,
          },
          {
            title: attributes.title,
          },
        ]}
      />
      <Heading title={attributes.title} isCentered />

      <div className={styles.contentBox}>
        <div style={{ marginBottom: "5px" }}>
          <Tag color="gold">{category}</Tag>
          <Tag icon={<EyeOutlined />} color="gold">
            {getAverageReadingTime(attributes.content)} min
          </Tag>
        </div>

        {attributes.content}

        <div className={styles.imageContainer}>
          <Image
            alt={coverAlt}
            fill
            style={{ objectFit: "cover" }}
            src={`${process.env.NEXT_PUBLIC_CMS_URL}${coverUrl}`}
          />
        </div>

        <div className={styles.authorBox}>
          <Avatar
            shape="square"
            icon={<RadarChartOutlined />}
            style={{ backgroundColor: "#111825", color: "#fff" }}
          />
          <p style={{ margin: "0px" }}>The Goodlife Guide. | {publishDate}</p>
        </div>
      </div>
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
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?filters[slug]=${params.pid}&populate=*`,
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
