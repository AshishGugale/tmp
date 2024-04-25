import React, { useEffect, useState } from "react";
import {
  SlidersTwoTone,
  ClockCircleTwoTone,
  DollarTwoTone,
} from "@ant-design/icons";
import { Avatar, Card, Skeleton, notification, Tooltip } from "antd";
import { CreateOfferOnChain, web3Object, getPrice } from "../integration/Scripts.js";
import { ethers } from "ethers";

const { Meta } = Card;
function SingleCard({ prop1 }) {
  const ListingId = parseInt(prop1.topics[2], 16);

  const [api, contextHolder] = notification.useNotification();
  const [price, setPrice] = useState(0);
  const [changed, setChanged] = useState(false);

  async function EventListener() {
    web3Object.contractInstance.on("BidSuccessful",
      (from, to, _amount, event) => {
        if (event.log.topics[2] == prop1.topics[2]) {
          setChanged(!changed);
          console.log("Rerendered: ", ListingId);
        }
      }
    );
  }

  useEffect(() => {
    async function retrievePrice() {
      const price = await getPrice(ListingId);
      setPrice(ethers.formatEther(price));
    }
    retrievePrice();
  }, [changed]);

  EventListener();

  async function handleBid() {
    try {
      const err = await CreateOfferOnChain(parseInt(prop1.topics[2], 16), 1000000);
      if(!err)
        api.success({
          message: "Success in Bid submission",
          description: `Successfully created bid on ${prop1.transactionHash}!`,
          className: "custom-class",
          style: {
            width: 600,
          },
          duration: "100",
        });
      throw err;
    } catch (err) {
      console.log(err);
      let response;
      if (err.revert)
        response = err.revert.args;
      else
        response = "Error occured in obtaining Metamask signature!";
      api.error({
        message: "Error in Bid creation",
        description: response,
        className: "custom-class",
        style: {
          width: 600,
        },
        duration: "100",
      });
    }
  }

  return (
    <Card
      style={{
        width: "33rem",
      }}
      hoverable
      // cover={<img alt="example" src="https://i.imgur.com/aF4OnAY.jpg" />}
      actions={[
        <Tooltip placement="bottom" title="Bid">
          <DollarTwoTone key="Bid" onClick={handleBid} />
        </Tooltip>,
        <Tooltip placement="bottom" title="Deadline">
          <ClockCircleTwoTone key="Deadline" />
        </Tooltip>,
        <Tooltip placement="bottom" title="Activity">
          <SlidersTwoTone key="Activity" />
        </Tooltip>,
      ]}
    >
      {contextHolder}
      <Skeleton loading={false} avatar active>
        <Meta
          avatar={<Avatar src="https://i.imgur.com/ww4Wa6O.jpg" />}
          title={`Listing ID: ${ListingId}`}
          description={`Current Price: ${price}`}
        />
      </Skeleton>
    </Card>
  );
}
export default SingleCard;
