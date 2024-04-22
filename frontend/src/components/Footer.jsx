import React from "react";
import { Layout } from "antd";
const Footer = Layout.Footer;

const FooterFunction = () => {
  return (
    <Footer
      style={{
        textAlign: "center",
      }}
    >
      SunStream ©{new Date().getFullYear()} Created by Ashish Gugale
    </Footer>
  );
};

export default FooterFunction;
