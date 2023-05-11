import { Tabs } from '@shopify/polaris';
import { useState } from 'react';
import Sale from "./SubTabs/Sale";
import Shares from "./SubTabs/Shares";
import FriendsReach from "./SubTabs/FriendsReach";


function  PromoPerformance() {

  const [selected, setSelected] = useState({ state: 0, id: "" });

  const tabs = [
    {
      id: 'Sales',
      content: 'Total Sales',
      accessibilityLabel: 'Total Sales',
      panelID: 'Total Sales',
    },
    {
      id: 'Share',
      content: 'Total Share',
      panelID: 'Total Share',
    },
    {
      id: 'Friedns Reached',
      content: 'Friedns_Reached',
      panelID: 'Friedns_Reached',
    }
  ];

  const handleTabChange = (number) => {
    setSelected({ state: number, id: "" });
  }

  function WhichToRender() {
    switch (selected.state) {
      case 0: {
        console.log("One")
        return (<Sale />)
      }

      case 1: {
        console.log("Two")
        return (<Shares />)
      }
      case 2: {
        console.log("Two")
        return (<FriendsReach />)
      }
    }
  }
  return (
    <Tabs tabs={tabs} selected={selected.state} onSelect={handleTabChange}>
      {/* {selected.state?<CreateCampaign prop={{selected,setSelected}}/>:<AllCampaigns prop={{selected,setSelected}}/>} */}
      {WhichToRender()}
    </Tabs>
  )
}

export default  PromoPerformance




