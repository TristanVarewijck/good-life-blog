import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  Statistic,
  Tabs,
  TabsProps,
} from "antd";
import Head from "next/head";
import { useState } from "react";
import Heading from "../../components/Heading";
import LayoutComponent from "../../components/LayoutComponent";
import PostPreviewCard from "../../components/PostPreviewCard";
import { openai } from "../../services/openai";

const Admin = ({ postDrafts, categories }) => {
  postDrafts.data.sort((a, b) => {
    Date.parse(b.attributes.createdAt) - Date.parse(a.attributes.createdAt);
  });

  const [currentItemGroup, setCurrentItemGroup] = useState<any[]>([]);
  const [isGeneratingPost, setIsGeneratingPost] = useState<boolean>(false);

  const onFinish = async (values: any) => {
    setIsGeneratingPost(true);

    try {
      const contentCompletion = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: `Can you write a detailed blog post about ${values.prompt}`,
        max_tokens: 1024,
        temperature: 0.2,
        n: 1,
      });

      const generatedContent =
        await contentCompletion.data.choices[0].text.trim();
      const categoryObj = await categories.data.filter((category) => {
        return category.attributes.name === values.category;
      });

      const newPostDraft = {
        data: {
          title: values.title,
          content: generatedContent,
          category: categoryObj,
          publishedAt: null,
        },
      };

      await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?populate=*`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPostDraft),
      });
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }
    setIsGeneratingPost(false);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  const onTapChange = (category: string) => {
    const filteredPosts = postDrafts.data.filter((draft) => {
      if (draft.attributes.category.data) {
        return draft.attributes.category.data.attributes.name === category;
      } else {
        return draft;
      }
    });

    setCurrentItemGroup(filteredPosts);
  };

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
                  slug={"#"}
                  title={item.attributes.title}
                  content={item.attributes.content}
                  cover={
                    item.attributes.cover.data
                      ? {
                          alt: item.attributes.cover.data.attributes.name,
                          url: `${process.env.NEXT_PUBLIC_CMS_URL}${item.attributes.cover.data.attributes.url}`,
                        }
                      : {
                          alt: "No Image placeholder",
                          url: "/no-img-placeholder.png",
                        }
                  }
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
          {postDrafts.data.map((item, index) => (
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
                        alt: "No Image placeholder",
                        url: "/no-img-placeholder.png",
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

  return (
    <LayoutComponent>
      <Head>
        <title>Blog</title>
      </Head>
      <Heading
        title={"Posts Drafts"}
        subtitle={
          "Here you can make posts with prompts and edit/publish these posts in Strapi CMS."
        }
      />
      <Row>
        <Col span={12}>
          <Form
            name="prompt"
            layout="vertical"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              label="Category"
              name="category"
              rules={[{ required: true, message: "select a category" }]}
            >
              <Select
                placeholder="Example: Lifestyle"
                options={categories.data.map((category) => {
                  return {
                    value: category.attributes.name,
                    label: category.attributes.name,
                  };
                })}
              />
            </Form.Item>

            <Form.Item
              label="Title"
              name="title"
              rules={[{ required: true, message: "fill in title" }]}
            >
              <Input placeholder="Example: How can i improve my productivy while working from home?" />
            </Form.Item>

            <Form.Item
              label="Prompt"
              name="prompt"
              rules={[{ required: true, message: "fill in subject" }]}
            >
              <Input placeholder="Can you write a detailed blog post about: Example subject" />
            </Form.Item>
            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                style={{ width: "100%" }}
                loading={isGeneratingPost}
              >
                Generate Post Draft
              </Button>
            </Form.Item>
          </Form>
        </Col>
        <Col
          span={12}
          style={{
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "35px",
            alignItems: "center",
          }}
        >
          <Statistic title="Drafts" value={postDrafts.data.length} />
          <Statistic title="Published" value="100" />
        </Col>
      </Row>

      <Tabs defaultActiveKey="all" items={items} onChange={onTapChange} />
    </LayoutComponent>
  );
};

export const getStaticProps = async () => {
  const postsDraftsRes = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?publicationState=preview&filters[publishedAt][$null]=true&populate=*`,
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
  const response = await Promise.all([postsDraftsRes, categoriesRes]);

  return {
    props: {
      postDrafts: await response[0].json(),
      categories: await response[1].json(),
    },
  };
};

export default Admin;
