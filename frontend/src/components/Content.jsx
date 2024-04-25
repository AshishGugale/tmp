import React from "react";
import { Layout, theme } from "antd";
import CardSection from "./CardSection";
import { ContentStyle, ContentInnerDivStyle } from "../styles/Styles.js";

const Content = Layout.Content;

const ContentFunction = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Content style={ContentStyle(colorBgContainer, borderRadiusLG)}>
      <div style={ContentInnerDivStyle(colorBgContainer, borderRadiusLG)}>
        <CardSection />
      </div>
    </Content>
  );
};

export default ContentFunction;
