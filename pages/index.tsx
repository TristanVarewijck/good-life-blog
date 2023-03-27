import Head from "next/head";
import LayoutComponent from "../components/LayoutComponent";
import { Col, Row, Tabs, AutoComplete } from "antd";
import type { TabsProps } from "antd";
import { useState } from "react";
import Heading from "../components/Heading";
import PostPreviewCard from "../components/PostPreviewCard";

const Blog = ({ posts, categories }) => {
  posts.data.sort((a, b) => {
    Date.parse(b.attributes.createdAt) - Date.parse(a.attributes.createdAt);
  });

  const [media, setMedia] = useState(posts);
  const [currentItemGroup, setCurrentItemGroup] = useState<any[]>([]);
  const [currentTab, setCurrentTab] = useState<string>("all");
  const postOptions: [{ value: string }] = posts.data.map((post) => {
    return {
      value: post.attributes.title,
    };
  });

  console.log(process.env.NEXT_PUBLIC_CMS_URL);

  const categoriesTabs = categories.data.map((category) => {
    return {
      key: category.attributes.name,
      label: category.attributes.name,
      children: (
        <Row gutter={[16, 16]}>
          {currentItemGroup.length > 0 ? (
            currentItemGroup.map((item, index) => (
              <Col key={index} xs={24} sm={12} md={8}>
                <PostPreviewCard
                  uid={item.attributes.title}
                  slug={`/${item.attributes.slug}`}
                  title={item.attributes.title}
                  content={item.attributes.content}
                  cover={{
                    alt: item.attributes.cover.data.attributes.name,
                    url: `${process.env.NEXT_PUBLIC_CMS_URL}${item.attributes.cover.data.attributes.url}`,
                  }}
                  publishedAt={item.attributes.publishedAt}
                />
              </Col>
            ))
          ) : (
            <p>
              There are no posts in Categorie:{" "}
              <span style={{ fontWeight: "bold" }}>
                {" " + category.attributes.name}
              </span>
            </p>
          )}
        </Row>
      ),
    };
  });

  const items: TabsProps["items"] = [
    {
      key: "all",
      label: `View all`,
      children: (
        <Row gutter={[16, 16]}>
          {media.data.map((item, index) => (
            <Col key={index} xs={24} sm={12} md={8}>
              <PostPreviewCard
                uid={item.attributes.title}
                slug={`/${item.attributes.slug}`}
                title={item.attributes.title}
                content={item.attributes.content}
                cover={
                  item.attributes.cover.data
                    ? {
                        alt: item.attributes.cover.data.attributes.name,
                        url: `${process.env.NEXT_PUBLIC_CMS_URL}${item.attributes.cover.data.attributes.url}`,
                      }
                    : {
                        alt: "",
                        url: "",
                      }
                }
                publishedAt={item.attributes.publishedAt}
              />
            </Col>
          ))}
        </Row>
      ),
    },
    ...categoriesTabs,
  ];

  // handle tab change (filter by category)
  const onTapChange = (category: string) => {
    setCurrentTab(category);
    if (category === "all") {
      setMedia(posts);
    } else {
      const filteredPosts = posts.data.filter((post) => {
        return post.attributes.category.data.attributes.name === category;
      });
      setCurrentItemGroup(filteredPosts);
    }
  };

  // handle search on "all";
  const getSearchRequest = (searchTerm) => {
    if (!searchTerm || searchTerm.length <= 0) {
      setMedia(posts);
    } else {
      const filteredPosts = posts.data.filter((post) =>
        post.attributes.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setMedia({
        data: [...filteredPosts],
      });
    }
  };

  return (
    <LayoutComponent>
      <Head>
        <title>The Good Life Guide</title>
      </Head>
      <Heading
        title={"The Good Life Guide."}
        subtitle={
          "Read everything about making your life better and becoming the best version of yourself."
        }
      />

      {currentTab === "all" && (
        <AutoComplete
          allowClear
          onChange={(value) => getSearchRequest(value)}
          style={{ width: "100%" }}
          options={postOptions}
          placeholder="try to type `b`"
          filterOption={(inputValue, option) =>
            option!.value.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1
          }
        />
      )}

      <Tabs defaultActiveKey="all" items={items} onChange={onTapChange} />
    </LayoutComponent>
  );
};

export const getStaticProps = async () => {
  const postsRes = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
      },
    }
  );
  const categoriesRes = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/categories`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_CATEGORY_CMS_ACTIONS}`,
      },
    }
  );
  const response = await Promise.all([postsRes, categoriesRes]);

  return {
    props: {
      posts: await response[0].json(),
      categories: await response[1].json(),
    },
  };
};

export default Blog;
