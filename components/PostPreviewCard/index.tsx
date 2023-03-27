import { Card } from "antd";
import { EditOutlined, SendOutlined, LikeOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { postProps } from "../../types";
import { getDateFormatCreatedAt } from "../Utils/parseDate";

const PostPreviewCard = ({
  uid,
  title,
  content,
  slug,
  cover,
  publishedAt,
}: postProps) => {
  const router = useRouter();
  const { Meta } = Card;
  const maxLengthContent = content.substring(0, 150);
  const previewText = maxLengthContent.trim() + "...";
  const parsedDate = getDateFormatCreatedAt(publishedAt);

  return (
    <Card
      key={uid}
      hoverable
      cover={
        <img
          alt={cover.alt}
          src={cover.url}
          onClick={() => router.push(slug)}
        />
      }
      actions={[
        <LikeOutlined key="like" />,
        <EditOutlined key="comment" />,
        <SendOutlined key="share" />,
      ]}
    >
      <div onClick={() => router.push(slug)}>
        <small
          style={{
            margin: "0 0 6px 0",
            display: "block",
            color: "rgba(17, 24, 37, 0.45)",
          }}
        >
          {parsedDate === "Invalid Date" ? "Not Published" : parsedDate}
        </small>
        <Meta title={title} description={previewText} />
      </div>
    </Card>
  );
};

export default PostPreviewCard;
