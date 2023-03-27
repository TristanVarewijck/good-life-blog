import styles from "./heading.module.scss";
import { Typography } from "antd";
import { headingProps } from "../../types";

const Heading = ({ title, subtitle, isCentered }: headingProps) => {
  const { Title, Paragraph } = Typography;
  return (
    <div className={styles.edits}>
      <Title
        style={
          isCentered && {
            textAlign: "center",
          }
        }
      >
        {title}
      </Title>
      <Paragraph>{subtitle}</Paragraph>
    </div>
  );
};

export default Heading;
