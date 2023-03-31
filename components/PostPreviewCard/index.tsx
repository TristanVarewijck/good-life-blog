import { Card } from "antd";
import { EditOutlined, SendOutlined, LikeOutlined } from "@ant-design/icons";
import { useRouter } from "next/router";
import { postProps } from "../../types";
import { getDateFormatCreatedAt } from "../Utils/parseDate";
import Image from "next/image";

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
  const maxLengthContent = content.substring(0, 85);
  const previewText = maxLengthContent.trim() + "...";
  const parsedDate = getDateFormatCreatedAt(publishedAt);

  return (
    <Card
      style={{ boxShadow: "0px 4px 12px rgba(0,0,0,0.1)" }}
      key={uid}
      hoverable
      cover={
        <div style={{ position: "relative", height: "275px" }}>
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            style={{ objectFit: "cover" }}
            onClick={() => router.push(slug)}
          />
        </div>
      }
      // actions={[
      //   <LikeOutlined key="like" />,
      //   <EditOutlined key="comment" />,
      //   <SendOutlined key="share" />,
      // ]}
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
