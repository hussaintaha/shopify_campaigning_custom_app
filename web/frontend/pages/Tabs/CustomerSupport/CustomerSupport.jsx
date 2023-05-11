
import { Tabs } from '@shopify/polaris';
import { useState } from 'react';
import FAQ from "./SubTabs/FAQ"
import ContactUs from "./SubTabs/ContactUs"


function  CustomerSupport() {

  const [selected, setSelected] = useState({ state: 0, id: "" });

  const tabs = [
    {
      id: 'Sales',
      content: 'Contact US',
      panelID: 'contactUs',
    },
    {
      id: 'Share',
      content: 'FAQ',
      panelID: 'faq',
    }
  ];

  const handleTabChange = (number) => {
    setSelected({ state: number, id: "" });
  }

  function WhichToRender() {
    switch (selected.state) {
      case 0: {
        console.log("One")
        return (<ContactUs />)
      }

      case 1: {
        console.log("Two")
        return (<FAQ />)
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

export default  CustomerSupport




