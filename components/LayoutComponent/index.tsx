import { Layout } from "antd";
import Navbar from "../Navbar";
import FooterCustom from "../FooterCustom";
import styles from "./layout.module.scss";

const LayoutComponent = ({ children }) => {
  const { Header, Content, Footer } = Layout;
  return (
    <Layout className={`layout ${styles.layoutEdits}`}>
      <Header style={{ paddingInline: "50px", padding: "0px" }}>
        <Navbar />
      </Header>
      <Content>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer>
        <FooterCustom />
      </Footer>
    </Layout>
  );
};

export default LayoutComponent;
