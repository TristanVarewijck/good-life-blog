import { Alert, Avatar, Breadcrumb, Tag } from "antd";
import Head from "next/head";
import Heading from "../components/Heading";
import LayoutComponent from "../components/LayoutComponent";
import styles from "./index.module.scss";
import { getDateFormatCreatedAt } from "../components/Utils/parseDate";
import { getAverageReadingTime } from "../components/Utils/readingTime";
import Image from "next/image";
import Link from "next/link";
import { RadarChartOutlined, EyeOutlined } from "@ant-design/icons";

const PostDetail = ({ publishedPosts, draftPosts }) => {
  const allPosts = [...publishedPosts.data, ...draftPosts.data];
  const { attributes } = allPosts[0];
  const publishDate = getDateFormatCreatedAt(attributes.createdAt);
  const coverUrl = attributes.cover.data.attributes.url;
  const coverAlt = attributes.cover.data.attributes.name;
  const category = attributes.category.data.attributes.name;

  if (!attributes.publishedAt) {
    console.log("This is private!");
    // alert("This is a Draft and needs authentication");
  } else {
    console.log("This is public");
  }

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

      {!attributes.publishedAt && (
        <Alert
          message="This is a draft post!"
          type="error"
          style={{ marginTop: "25px", textAlign: "center" }}
        />
      )}
      <Heading title={attributes.title} isCentered />

      <div className={styles.contentBox}>
        <div style={{ marginBottom: "15px" }}>
          <Tag color="gold">{category}</Tag>
          <Tag icon={<EyeOutlined />} color="gold">
            {getAverageReadingTime(attributes.content)} min
          </Tag>
        </div>
        <div className={styles.imageContainer}>
          <Image
            alt={coverAlt}
            fill
            style={{ objectFit: "cover" }}
            src={`${process.env.NEXT_PUBLIC_CMS_URL}${coverUrl}`}
          />
        </div>
        {attributes.content}
        <div className={styles.authorBox}>
          <Avatar
            shape="square"
            icon={<RadarChartOutlined />}
            style={{ backgroundColor: "#111825", color: "#fff" }}
          />
          <p style={{ margin: "35px 0 0 0" }}>
            The Goodlife Guide. | {publishDate}
          </p>
        </div>
      </div>
    </LayoutComponent>
  );
};

export const getStaticPaths = async () => {
  const postPublishedRes = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
      },
    }
  );

  const postDraftsRes = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?publicationState=preview&filters[publishedAt][$null]=true`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
      },
    }
  );

  const response = await Promise.all([postPublishedRes, postDraftsRes]);
  const published = await response[0].json();
  const drafts = await response[1].json();

  const posts = [...published.data, ...drafts.data];
  const paths = posts.map((content, _index) => ({
    params: { pid: content.attributes.slug },
  }));

  return { paths, fallback: "blocking" };
};

export const getStaticProps = async ({ params }) => {
  const publishRes = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?filters[slug]=${params.pid}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
      },
    }
  );

  const draftRes = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?publicationState=preview&filters[publishedAt][$null]=true&filters[slug]=${params.pid}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
      },
    }
  );

  const response = await Promise.all([publishRes, draftRes]);

  return {
    props: {
      publishedPosts: await response[0].json(),
      draftPosts: await response[1].json(),
    },
  };
};

export default PostDetail;
