
import { Tabs } from '@shopify/polaris';
import { useState } from 'react';

import Overview from "./Tabs/Overview";
import CustomerSales from "./Tabs/CustomerSales";
import PromotionManager from './Tabs/PremotionManager/PromotionManager';
import PromoPerformance from "./Tabs/PremotionPerformance/PromoPerformance";
import CustomerSupport from "./Tabs/CustomerSupport/CustomerSupport"


export default function HomePage() {

  const [selected, setSelected] = useState({ state: 0, id: "" });
  
  const tabs = [
    {
      id: 'Install-Campaign',
      content: 'Overview',
      panelID: 'Install-Campaign',
    },
    {
      id: "Customer-Sale",
      content: 'Customer Sales',
      panelID: "Customer-Sale"
    },
    {
      id: 'Premotion-Manager',
      content: 'Promotion Manager',
      panelID: 'Promotion Manager',
    },
    {
      id: 'Premotion-Performance',
      content: 'Promotion Performance',
      panelID: 'Promotion-Performance',
    },
    {
      id: 'Customer-Support',
      content: 'Customer Support',
      panelID: 'Customer Support',
    }

  ];

  const handleTabChange = (number) => {
    setSelected({ state: number, id: "" });
  }

  function WhichToRender() {
    switch (selected.state) {
      case 0: {
        // console.log("zero")
        return (<Overview />)
      }

      case 1: {
        // console.log("Three")
        return (<CustomerSales />)
      }

      case 2: {
        // console.log("One")
        return (<PromotionManager />)
      }

      case 3: {
        // console.log("three")
        return (<PromoPerformance />)
      }
      case 4: {
        // console.log("three")
        return (<CustomerSupport />)
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