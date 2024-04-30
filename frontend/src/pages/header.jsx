import React, { useState } from "react";
import { Layout } from "antd";
const Content = Layout.Content;
export default function Header() {
  const headerMenu = [
    {
      id: 1,
      name: "Ride",
      icon: "/taxi.png",
    },
  ];
  return (
    <Content>
      {headerMenu.map((item) => (
        <div className="flex gap-2 items-center">
          <h2 className="text-[14px] font-medium">{item.name}</h2>
        </div>
      ))}
    </Content>
  );
}
