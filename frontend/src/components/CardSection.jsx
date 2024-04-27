import React, { useState, useEffect } from "react";
import SingleCard from "./SingleCard";
import { Skeleton, Space } from "antd";
import { getLogs, web3Object } from "../integration/Scripts.js";
import {CardFlexStyle } from "../styles/Styles.js";

const CardSection = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [changed, setChanged] = useState(false);

  useEffect(() => {
    async function getAndSetData() {
      setIsLoading(true);
      const data = await getLogs("ItemCreated(address,uint256,uint256)");
      setData(data);
      setIsLoading(false);
    }
    getAndSetData();
  }, [changed]);

  useEffect(() => {
    const listener = (from, to, _amount, event) => {
      setChanged(!changed);
    }  
    web3Object.contractInstance.on("ItemCreated", listener);
    return () => {
      web3Object.contractInstance.off("ItemCreated", listener);
    }
  }, []);

  const renderCards = () => {
    if (!data.length && !isLoading) {
      return <p>No listings yet!</p>;
    }
    return (
      <>
        {isLoading ? (
          <Skeleton active></Skeleton>
        ) : (
          <Space size={[8, 16]} wrap>
            {data.map((dataItem, index) => (
              <div key={index} className="card-item" style={CardFlexStyle}>
                <SingleCard prop1={dataItem} />
              </div>
            ))}
          </Space>
        )}
      </>
    );
  };

  return <>{renderCards()}</>;
};

export default CardSection;
