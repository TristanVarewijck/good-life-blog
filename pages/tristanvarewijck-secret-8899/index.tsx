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
import {
  executeTextGeneration,
  executeImageGeneration,
} from "../../components/Utils/openai";
const FormData = require("form-data");

const Admin = ({ postDrafts, categories, postPublished }) => {
  postDrafts.data.sort((a, b) => {
    Date.parse(b.attributes.createdAt) - Date.parse(a.attributes.createdAt);
  });
  const [drafts, setDrafts] = useState(postDrafts);
  const [currentItemGroup, setCurrentItemGroup] = useState<any[]>([]);
  const [isGeneratingPost, setIsGeneratingPost] = useState<boolean>(false);
  const [form] = Form.useForm();

  // handling the submission
  const onFinish = async (values: any) => {
    setIsGeneratingPost(true);
    try {
      const categoryObj = await categories.data.filter((category) => {
        return category.attributes.name === values.category;
      });

      // text generation
      const textCompletion = await executeTextGeneration({
        prompt: `Can you write a detailed blog post about ${values.prompt}`,
        max_tokens: 1024,
        temperature: 0.2,
        n: 1,
      });

      // text content
      const generatedContent = await textCompletion.data.choices[0].text.trim();

      // image generation
      const imageCompletion = await executeImageGeneration({
        prompt: values.title,
        imageSize: "256x256",
      });

      // image url / response / blob
      const generatedImageUrl = await imageCompletion.data.data[0].url;
      const resGeneratedImageUrl = await fetch(generatedImageUrl);
      const resGeneratedImageUrlBlob = await resGeneratedImageUrl.blob();

      // new post object
      const newPostDraft = {
        data: {
          title: values.title,
          content: generatedContent,
          category: categoryObj,
          slug: values.title.split(" ").join("_"),
          publishedAt: null,
        },
      };

      // response of new object in STRAPI
      const newPostDraftResponse = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?populate=*`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(newPostDraft),
        }
      );

      // Just uploaded object from response
      const newPostDraftData = await newPostDraftResponse.json();

      // connect the generated image to the just uploaded obect
      const imageData = await new FormData();
      await imageData.append(
        "files",
        resGeneratedImageUrlBlob,
        `${values.title.split(" ").join("_")}.png`
      );
      await imageData.append("ref", "api::post.post");
      await imageData.append("refId", newPostDraftData.data.id);
      await imageData.append("field", "cover");

      // upload image to STRAPI
      await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/api/upload`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
        },
        method: "POST",
        body: imageData,
      });

      // get new drafts array from STRAPI
      const latestPostDrafts = await fetch(
        `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?publicationState=preview&filters[publishedAt][$null]=true&populate=*`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
          },
        }
      );

      // parse and update the updated drafts array in UI
      const latestPostDraftsResponse = await latestPostDrafts.json();
      setDrafts(latestPostDraftsResponse);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
      }
    }

    // reset loading and form fields states
    setIsGeneratingPost(false);
    form.resetFields();
  };

  // submit has failed
  const onFinishFailed = (errorInfo: any) => {
    alert(errorInfo);
  };

  // changed tab / category
  const onTapChange = (category: string) => {
    const filteredPosts = drafts.data.filter((draft) => {
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
          {drafts.data.map((item, index) => (
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
        <title>Admin</title>
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
            form={form}
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
                disabled={isGeneratingPost}
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
              <Input
                disabled={isGeneratingPost}
                placeholder="Example: How can i improve my productivy while working from home?"
              />
            </Form.Item>

            <Form.Item
              label="Prompt"
              name="prompt"
              rules={[{ required: true, message: "fill in subject" }]}
            >
              <Input
                disabled={isGeneratingPost}
                placeholder="Can you write a detailed blog post about: Example subject"
              />
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
          <Statistic title="Drafts" value={drafts.data.length} />
          <Statistic title="Published" value={postPublished.data.length} />
        </Col>
      </Row>

      <Tabs defaultActiveKey="all" items={items} onChange={onTapChange} />
    </LayoutComponent>
  );
};

export const getServerSideProps = async () => {
  const postsPublishedRes = fetch(
    `${process.env.NEXT_PUBLIC_CMS_URL}/api/posts?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_POST_CMS_ACTIONS}`,
      },
    }
  );

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
  const response = await Promise.all([
    postsDraftsRes,
    categoriesRes,
    postsPublishedRes,
  ]);

  return {
    props: {
      postDrafts: await response[0].json(),
      categories: await response[1].json(),
      postPublished: await response[2].json(),
    },
  };
};

export default Admin;
