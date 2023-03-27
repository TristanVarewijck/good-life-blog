import styles from "./navbar.module.scss";
import type { MenuProps } from "antd";
import { Menu } from "antd";
import Link from "next/link";
import { useRouter } from "next/router";

const items: MenuProps["items"] = [
  {
    label: <Link href={"/"}>Guide</Link>,
    key: "/",
  },
  // {
  //   label: "Products",
  //   key: "/products",
  //   children: [
  //     {
  //       type: "group",
  //       label: "group 1",
  //       children: [
  //         {
  //           label: <Link href={"/products/option-1"}>Option 1</Link>,
  //           key: "setting:1",
  //         },
  //         {
  //           label: <Link href={"/products/option-2"}>Option 2</Link>,
  //           key: "setting:2",
  //         },
  //       ],
  //     },
  //     {
  //       type: "group",
  //       label: "group 2",
  //       children: [
  //         {
  //           label: <Link href={"/products/option-3"}>Option 3</Link>,
  //           key: "setting:3",
  //         },
  //         {
  //           label: <Link href={"/products/option-4"}>Option 4</Link>,
  //           key: "setting:4",
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   label: <Link href={"/pricing"}>Pricing</Link>,
  //   key: "/pricing",
  // },
  // {
  //   label: <Link href="/login">Login / register</Link>,
  //   key: "/login",
  // },
];

const Navbar = () => {
  const router = useRouter();
  const path = router.pathname;
  const activeTab = "/" + path.split("/")[1];

  return (
    <Menu
      className={styles.edits}
      selectedKeys={[activeTab]}
      mode="horizontal"
      items={items}
    />
  );
};

export default Navbar;
