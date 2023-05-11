import React, { useState, useEffect } from 'react'
import { useAuthenticatedFetch } from '@shopify/app-bridge-react'
import { Frame, Layout, Page, Spinner, Icon } from '@shopify/polaris';
import { ShareMinor } from '@shopify/polaris-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function FriendsReach() {

  const authFetch = useAuthenticatedFetch()
  const [shareCount, setShareCount] = useState([])
  const [loading, setLoading] = useState(false)


  async function GetShareCount() {
    setLoading(true)
    const resp = await authFetch("/api/admin/merchant/performance/share")
    const result = await resp.json();

    GetDifferenceInMonths(result.data)
    setLoading(false)
  }

  function GetDifferenceInMonths(dataArray) {

    console.log("here is the formate Date Function ")

    const shareArray = [
      { month: "Jan" , FriendsReach: 0 },
      { month: "Feb" , FriendsReach: 0 },
      { month: "Mar" , FriendsReach: 0 },
      { month: "Apr" , FriendsReach: 0 },
      { month: "May" , FriendsReach: 0 },
      { month: "Jun" , FriendsReach: 0 },
      { month: "Jul" , FriendsReach: 0 },
      { month: "Aug" , FriendsReach: 0 },
      { month: "Sep" , FriendsReach: 0 },
      { month: "Oct" , FriendsReach: 0 },
      { month: "Nov" , FriendsReach: 0 },
      { month: "Dec" , FriendsReach: 0 },
    ]

    const now = new Date();
    dataArray?.forEach((el, i) => {
      const tempDate = new Date(el.createdAt)

      // let months;
      // months = (now.getFullYear() - tempDate.getFullYear()) * 12;
      // months -= tempDate.getMonth();
      // months += now.getMonth();
      // const difference = months <= 0 ? 0 : months;

      const difference = tempDate.getMonth()
      console.log("difference ", difference)

      shareArray[difference].FriendsReach = shareArray[difference].FriendsReach + el.user_details.length

    })

    console.log("shareArray  -=-=--= ", shareArray)
    setShareCount(shareArray)
  }

  useEffect(() => {
    GetShareCount()
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
            <div className="salesTab">
              <div className="SaleCountCard">
                <div className="cardDivParent">
                  <div className='saleCardDiv' >
                    <div className="leftSection">
                      <h3 className='heading'>This month Shares</h3>
                      <h2 className='actualValue'>{shareCount[new Date().getMonth()]?.FriendsReach}</h2>
                    </div>
                    <div className='rightSection'>
                      <div className="saleIcon">
                        <Icon source={ShareMinor} color="base" />
                      </div>
                      {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                    </div>
                  </div>
                  <div className='saleCardDiv'>
                    <div className="leftSection">
                      <h3 className='heading'>Last month Shares</h3>
                      <h2 className='actualValue'>{new Date().getMonth() == 0 ? (shareCount[11]?.FriendsReach)?.toLocaleString() : (shareCount[new Date().getMonth() - 1]?.FriendsReach)?.toLocaleString()}</h2>
                      
                    </div>
                    <div className='rightSection'>
                      <div className="saleIcon">
                        <Icon source={ShareMinor} color="base" />
                      </div>
                      {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                    </div>
                  </div>
                </div>
                <div className="saleChart">
                  <ResponsiveContainer width="100%" aspect={2}>
                    <BarChart
                      data={shareCount}
                      margin={{
                        top: 50,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      {/* <CartesianGrid strokeDasharray="3 3" opacity={0.5} /> */}
                      <CartesianGrid opacity={0.2} />
                      <XAxis  dataKey="month" />
                      <YAxis  />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="FriendsReach" fill="#84c89e" />

                    </BarChart>
                  </ResponsiveContainer>
                </div>

              </div>
            </div>
          }
        </Layout>
      </Page>
    </Frame>
  )
}

export default FriendsReach
