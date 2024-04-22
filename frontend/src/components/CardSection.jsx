import React, { useState, useEffect } from "react";
import SingleCard from "./SingleCard";
import { Card, Skeleton, notification } from "antd";
import {
  getLogs,
  CreateListingOnChain,
  CreateUserOnChain,
  web3Object
} from "../integration/Scripts.js";
import { CardSectionStyle, CardFlexStyle } from "../styles/Styles.js";

const CardSection = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [changed, setChanged] = useState(false);
  const [api, contextHolder] = notification.useNotification();


  useEffect(() => {
    async function getAndSetData() {
      setIsLoading(true);
      const data = await getLogs("ItemCreated(address,uint256,uint256)");
      setData(data);
      setIsLoading(false);
    }
    getAndSetData();
  }, [changed]);

  
  async function EventListener2() {
    web3Object.contractInstance.on("ItemCreated", (from, to, _amount, event) => {
      console.log(event);
      api.success({
        message: "Success in Item creation",
        description: `Successfully created Item with event ${event}`,
        className: "custom-class",
        style: {
          width: 600,
        },
      })
      setChanged(!changed);
    });
  }

  EventListener2();

  const handleCreateItem = async () => {
    setIsLoading(true);
    await CreateListingOnChain(100, "Ashish");
    setIsLoading(false);
    setChanged(!changed);
  };
  const handleCreateUser = async () => {
    setIsLoading(true);
    await CreateUserOnChain();
    setIsLoading(false);
    setChanged(!changed);
  };
  const renderCards = () => {
    if (!data.length && !isLoading) {
      return <p>No listings yet!</p>;
    }
    return (
      <>
        {isLoading ? (
          <Skeleton active></Skeleton>
        ) : (
          <div className="grid-container" style={CardSectionStyle}>
            {data.map((dataItem, index) => (
              <div key={index} className="card-item" style={CardFlexStyle}>
                <SingleCard prop1={dataItem} />
              </div>
            ))}
          </div>
        )}
      </>
    );
  };

  return <>{renderCards()}</>;
};

export default CardSection;
