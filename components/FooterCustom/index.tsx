import styles from "./footerCustom.module.scss";
import Image from "next/image";

const FooterCustom = () => {
  const currentYear = new Date().getFullYear();
  return (
    <div className={styles.footer}>
      {/* 1 */}
      <div className="big-section">
        {/* 1 */}
        <div className="links">
          <div>
            <Image
              src={"/logo.svg"}
              alt={"The Goodlife guide logo svg"}
              width={40}
              height={100}
            />
            <p>The Goodlife Guide</p>
          </div>

          {/* 2 */}
          <div className="page-links">
            <ul>
              <li>Guide</li>
              <li>Shop</li>
              <li>Gallery</li>
            </ul>
          </div>

          {/* 3 */}
          <div className="socials">
            <ul>
              <li>Instagram</li>
              <li>Facebook</li>
              <li>TikTok</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="small-section">
        {/* 1 */}
        <div className="copyright-notice">
          <p>
            The Goodlife Guide. ©{currentYear}. Created by Tristan Varewijck.
          </p>
          <p>Created by: The Goodlife Guide</p>
        </div>
      </div>
    </div>
  );
};

export default FooterCustom;
