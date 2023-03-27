import { Layout } from "antd";
import Navbar from "../Navbar";
import styles from "./layout.module.scss";

const LayoutComponent = ({ children }) => {
  const currentYear = new Date().getFullYear();
  const { Header, Content, Footer } = Layout;
  return (
    <Layout className={`layout ${styles.layoutEdits}`}>
      <Header style={{ paddingInline: "50px", padding: "0px" }}>
        <Navbar />
      </Header>
      <Content>
        <div className="site-layout-content">{children}</div>
      </Content>
      <Footer className={styles.footer}>
        The Good Life Guide. ©{currentYear}. Created by Tristan Varewijck.
      </Footer>
    </Layout>
  );
};

export default LayoutComponent;
