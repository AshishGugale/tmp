import React, { useState, useEffect, useMemo } from "react";
import { Form, Input, theme, Layout, Button, notification } from "antd";
import { CreateListingOnChain } from "../integration/Scripts";
import { useNavigate } from "react-router-dom";
const Content = Layout.Content;
const Context = React.createContext({
  name: "Default",
});

const App = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [price, setPrice] = useState(0);
  const [api, contextHolder] = notification.useNotification();

  async function handleCreateListing() {
    try {
      if (price === 0) return;
      const tx = await CreateListingOnChain(price);
      if (tx) {
        api.error({
          message: `Notification`,
          description: "",
          placement: "topRight",
        });
      } else {
        api.success({
          message: "Success in listing creation!!",
          description: "",
          placement: "topRight",
        });
        navigate("/");
      }
      setPrice(0);
    } catch (err) {
      console.log(err);
    }
  }
  const handlePriceChange = (event) => {
    const newPrice = parseFloat(event.target.value);
    setPrice(newPrice);
  };
  return (
    <>
      {contextHolder}
      <Content
        style={{
          display: "flex",
          margin: "20px 16px 0",
          overflow: "initial",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
          justifyContent: "center",
        }}
      >
        <Form
          name="basic"
          labelCol={{
            span: 8,
          }}
          labelWrap
          wrapperCol={{
            span: 16,
          }}
          style={{
            maxWidth: 600,
            marginTop: "50px",
          }}
          initialValues={{
            remember: true,
          }}
          onFinish={handleCreateListing}
          autoComplete="off"
        >
          <Form.Item
            label="Listing Price (In ETH)"
            name="ListingPrice"
            rules={[
              {
                required: true,
                message: "Please enter the listing value!",
              },
            ]}
          >
            <Input type="number" onChange={handlePriceChange} value={price} />
          </Form.Item>
          <p>Current price in Eth: {price}</p>
          <Form.Item
            wrapperCol={{
              offset: 8,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Content>
    </>
  );
};
export default App;
