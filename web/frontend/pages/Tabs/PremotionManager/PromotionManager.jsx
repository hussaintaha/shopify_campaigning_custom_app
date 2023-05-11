
import React from 'react'
import { Tabs } from '@shopify/polaris';
import { useState } from 'react';
import CreateCampaign from "./SubTabs/CreateCampaign"
import AllCampaigns from "./SubTabs/AllCampaigns";
import Introduction from './SubTabs/Introduction';

function PromotionManager() {

  const [selected, setSelected] = useState({ state: 0, id: "" });

  const tabs = [
    {
      id: 'Introduction',
      content: 'STEP 1- Intro and Setup',
      accessibilityLabel: 'STEP 1- Intro and Setup',
      panelID: 'Introduction_and_SetUP',
    },
    {
      id: 'all-campaigns',
      content: 'STEP 2- Create New Campaign',
      accessibilityLabel: 'STEP 2- Create New Campaign',
      panelID: 'all-customers-content-1',
    },
    {
      id: 'Create-Campaign',
      content: 'STEP 3- All Campaigns',
      panelID: 'STEP 3- All Campaigns',
    }
  ];

  const handleTabChange = (number) => {
    setSelected({ state: number, id: "" });
  }

  function WhichToRender() {
    switch (selected.state) {
      case 0: {
        return (<Introduction />)
      }
      case 1: {
        console.log("Two")
        return (<CreateCampaign prop={{ selected, setSelected }} />)
      }

      case 2: {
        console.log("One")
        return (<AllCampaigns prop={{ selected, setSelected }} />)
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






export default PromotionManager
