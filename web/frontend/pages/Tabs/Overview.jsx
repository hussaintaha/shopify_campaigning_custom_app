import "../../css/overview.css"
import "../../css/modifyingPolaris.css"
import React, { useEffect, useState } from 'react'
import { Frame, Layout, Page, Spinner, Thumbnail, Icon } from '@shopify/polaris';
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import {
    AnalyticsMajor,
    CashDollarMajor,
    ShareMinor,
    CustomersMajor
} from '@shopify/polaris-icons';

function Overview() {

    const [customer, setCustomer] = useState([])

    const authFetch = useAuthenticatedFetch();

    const [overviewData, setOverviewData] = useState({ "totalSale": 0, "saleVolume": 0, "totalShare": 0, "total_Friedns_Reach": 0 })
    const [loading, setLoading] = useState(false)

    async function createDefaultCampaign() {
        const createCampaign = await authFetch("/api/campaigns/create_default_campaign")
        console.log("create campaign ",createCampaign)
        const result = await createCampaign.json()
    }

    async function getOverviewData() {
        setLoading(true)
        console.log("calling Get Overview")
        const resp = await authFetch("/api/admin/merchant/overview")
        const data = await resp.json();
        console.log("data is ",data)
        setOverviewData({ ...overviewData, ...data?.data })
        console.log(" customElements ", data)
        setCustomer(data?.customersSale)
        setLoading(false)
    }

    async function RegisterTheShop() {
        // console.log("calling add me")
        const data = await authFetch("/api/addme")
        console.log("add me resp ",await data.json())
    }
    
    useEffect(() => {
        RegisterTheShop();
        getOverviewData()
    }, [])

    createDefaultCampaign();
    return (
        <Frame>
            <Page fullWidth>
                <Layout>
                    {loading ?
                        <div className="spinnerContainer">
                            <Spinner accessibilityLabel="Spinner example" size="large" />
                        </div>
                        :

                        <>
                            <div className='cardDivCollection'>
                                <div className="cardsTop">
                                    <div className='cardDiv firstCard' >
                                        <div className="leftSection">
                                            <h3 className='heading'>Total Sales</h3>
                                            <h2 className='actualValue'>{overviewData.totalSale}</h2>
                                        </div>
                                        <div className='rightSection'>
                                            <div className="icon icon1">

                                                <Icon source={AnalyticsMajor} color="base" />
                                            </div>
                                            {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                                        </div>
                                    </div>
                                    <div className='cardDiv secondCard'>
                                        <div className="leftSection">

                                            <h3 className='heading'>Total Sales Volume</h3>
                                            <h2 className='actualValue'>$ {(overviewData.saleVolume)?.toLocaleString()}</h2>
                                        </div>
                                        <div className='rightSection'>
                                            <div className="icon icon2">
                                                <Icon source={CashDollarMajor} color="base" />
                                            </div>
                                            {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="cardsBottom">
                                    <div className='cardDiv thirdCard'>
                                        <div className="leftSection">

                                            <h3 className='heading'>Total Shares</h3>
                                            <h2 className='actualValue'>{overviewData.totalShare}</h2>
                                        </div>
                                        <div className='rightSection'>
                                            <div className="icon icon3">
                                                <Icon source={ShareMinor} color="base" />
                                            </div>
                                            {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                                        </div>
                                    </div>
                                    <div className='cardDiv fourthCard'>
                                        <div className="leftSection">

                                            <h3 className='heading'>Total Friends Reached</h3>
                                            <h2 className='actualValue'>{overviewData.total_Friedns_Reach}</h2>
                                        </div>
                                        <div className='rightSection'>
                                            <div className="icon icon4">
                                                <Icon source={CustomersMajor} color="base" />
                                            </div>
                                            {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="latestCustomer">
                                <h1>Recent Customers Sale</h1>
                                <div className="customersList">

                                    <table style={{ width: "100%", textAlign: "center" }}>
                                        <thead >
                                            <tr className='tabel_head_ul'>
                                                <th className='indexTD'>S.N</th>
                                                <th>Date</th>
                                                <th>Name</th>
                                                <th>Email ID</th>
                                                <th>Order Id</th>
                                                <th>Amount</th>
                                            </tr>
                                        </thead>
                                        {customer?.length <= 0 ?
                                            <tbody>

                                                <tr className='noDataFound'>
                                                    <td colSpan="7"> No Data To Show</td>
                                                </tr>
                                            </tbody>
                                            :
                                            <tbody>
                                                {customer?.map((element, index) => {
                                                    return (

                                                        <tr key={index} className="singleColumn">
                                                            <td data-label="S.N" className='indexTD' >{index + 1}</td>
                                                            <td data-label="Date" >{(new Date(element?.order_date)).toLocaleDateString()}</td>
                                                            <td data-label="Name" >{element?.user_first + " " + element?.user_last}</td>
                                                            <td data-label="Email ID" >{element?.user_email}</td>
                                                            <td data-label="Order ID" > {element?.transection_ID}</td>
                                                            <td data-label="Total Sales" >$ {(element?.transection_amount)?.toLocaleString()}</td>
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        }
                                    </table>
                                </div>
                            </div>
                        </>
                    }
                </Layout>
            </Page>
        </Frame>
    )
}

export default Overview