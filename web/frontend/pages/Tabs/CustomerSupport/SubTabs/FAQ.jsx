import "../../../../css/CustomerSupport/faq.css"
import React, { useEffect, useState } from 'react'
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { Frame, Layout, Page, Spinner } from '@shopify/polaris';
import AccordionItem from "./AccordionItem";

function FAQ() {

  const authFetch = useAuthenticatedFetch()

  const [loading, setLoading] = useState(false)
  const [faqTabel, setFaqTabel] = useState([])
  const [clicked, setClicked] = useState("0");



  async function getFaqList() {
    setLoading(true)
    const data = await authFetch("/api/admin/merchant/support/faq")
    const resp = await data.json()

    console.log("resp is ", resp)
    setFaqTabel(resp.data)
    setLoading(false)
  }

  const handleToggle = (index) => {
    if (clicked === index) {
      return setClicked("0");
    }
    setClicked(index);
  };

  useEffect(() => {
    getFaqList()
  }, [])

  return (
    <Frame>
      <Page fullWidth>
        <Layout>
          {loading ?
            <div className="spinnerContainer">
              <Spinner accessibilityLabel="Spinner example" size="large" />
            </div>
            :
            <div className="faq_container">

              <ul className="accordion">
                {faqTabel?.map((faq, index) => (
                  <AccordionItem
                    onToggle={() => handleToggle(index)}
                    active={clicked === index}
                    key={index}
                    faq={faq}
                  />
                ))}
              </ul>

            </div>
          }
        </Layout>
      </Page>
    </Frame>
  )
}

export default FAQ
