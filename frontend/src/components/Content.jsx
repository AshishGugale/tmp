import React from "react";
import { Layout, theme } from "antd";
import CardSection from "./CardSection";
import { ContentStyle, ContentInnerDivStyle } from "../styles/Styles.js";
import { CreateListingOnChain, checkValidUser } from "../integration/Scripts.js";
import { Button } from "antd";

const Content = Layout.Content;

const ContentFunction = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const handleClick = async () => {
    const tx = await checkValidUser();
    console.log(tx);
  }
  return (
    <Content style={ContentStyle(colorBgContainer, borderRadiusLG)}>
      <div style={ContentInnerDivStyle(colorBgContainer, borderRadiusLG)}>
        <CardSection />
      </div>
    </Content>
  );
};

export default ContentFunction;
