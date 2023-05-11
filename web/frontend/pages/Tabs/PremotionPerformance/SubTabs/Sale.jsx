import "../../../../css/PromotionPerformance/sales.css"
import React, { useState, useEffect } from 'react'
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { Frame, Layout, Page, Spinner, Icon } from '@shopify/polaris';
import {CashDollarMajor, AnalyticsMajor } from '@shopify/polaris-icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


function Sale() {
    const authFetch = useAuthenticatedFetch();

    const [loading, setLoading] = useState(false)
    const [saleTabel, setSaleTabel] = useState([])

    async function GetTheSales() {
        setLoading(true)
        authFetch("/api/admin/merchant/customers/sale")
            .then((resp) => { return resp.json() })
            .then((data) => {
                console.log("data from the server customres sale", data)
                GetDifferenceInMonths(data.data, setSaleTabel)
                setLoading(false)
            })
    }
    function GetDifferenceInMonths(dataArray, setTheData) {

        console.log("here is the formate Date Function ")

        const saleArray = [
            { month: "Jan" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Feb" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Mar" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Apr" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "May" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Jun" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Jul" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Aug" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Sep" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Oct" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Nov" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
            { month: "Dec" , MonthlySaleCount: 0, TotalSaleVolume: 0 },
        ]

        const now = new Date();

        dataArray?.forEach((el, i) => {

            const tempDate = new Date(el.order_date)

            // let months;
            // months = (now.getFullYear() - tempDate.getFullYear()) * 12;
            // months -= tempDate.getMonth();
            // months += now.getMonth();
            // const difference = months <= 0 ? 0 : months;

            const difference = tempDate.getMonth()
            console.log("difference ", difference)

            saleArray[difference].MonthlySaleCount = saleArray[difference].MonthlySaleCount + 1
            console.log(`${saleArray[difference].TotalSaleVolume} +  ${el.transection_amount}  =  ${saleArray[difference].TotalSaleVolume + el.transection_amount}`)
            saleArray[difference].TotalSaleVolume = parseFloat((saleArray[difference].TotalSaleVolume + el.transection_amount).toFixed(2))

        })
        // console.log("saleArray  -=-=--= ", saleArray)

        setTheData(saleArray)


    }

    useEffect(() => {
        GetTheSales()
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
                                            <h3 className='heading'>This month Number of sales</h3>
                                            <h2 className='actualValue'>{saleTabel[new Date().getMonth()]?.MonthlySaleCount}</h2>
                                        </div>
                                        <div className='rightSection'>
                                            <div className="saleIcon">
                                                <Icon source={AnalyticsMajor} color="base" />
                                            </div>
                                            {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                                        </div>
                                    </div>
                                    <div className='saleCardDiv'>
                                        <div className="leftSection">
                                            <h3 className='heading'>Last month Number of sales</h3>
                                            <h2 className='actualValue'>{new Date().getMonth() == 0 ? (saleTabel[11]?.MonthlySaleCount)?.toLocaleString() : (saleTabel[new Date().getMonth() - 1]?.MonthlySaleCount)?.toLocaleString()}</h2>
                                            
                                        </div>
                                        <div className='rightSection'>
                                            <div className="saleIcon">
                                                <Icon source={AnalyticsMajor} color="base" />
                                            </div>
                                            {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="saleChart">
                                    <ResponsiveContainer width="100%" aspect={2}>
                                        <BarChart
                                            data={saleTabel}
                                            margin={{
                                                top: 50,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            {/* <CartesianGrid strokeDasharray="3 3" opacity={0.5} /> */}
                                            <CartesianGrid opacity={0.2} />
                                            <XAxis dataKey="month" />
                                            <YAxis />
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="MonthlySaleCount" fill="#84c89e" />

                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>
                            <div className="SaleCountCard">
                                <div className="cardDivParent">
                                    <div className='saleCardDiv' >
                                        <div className="leftSection">
                                            <h3 className='heading'>This Month Total Sales Volume</h3>
                                            <h2 className='actualValue'>${(saleTabel[new Date().getMonth()]?.TotalSaleVolume)?.toLocaleString()}</h2>
                                        </div>
                                        <div className='rightSection'>
                                            <div className="saleIcon">
                                                <Icon source={CashDollarMajor} color="base" />
                                            </div>
                                            {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                                        </div>
                                    </div>
                                    <div className='saleCardDiv'>
                                        <div className="leftSection">
                                            <h3 className='heading'>Last month Number of sales</h3>
                                            <h2 className='actualValue'>${new Date().getMonth() == 0 ? (saleTabel[11]?.TotalSaleVolume)?.toLocaleString() : (saleTabel[new Date().getMonth() - 1]?.TotalSaleVolume)?.toLocaleString()}</h2>
                                            
                                        </div>
                                        <div className='rightSection'>
                                            <div className="saleIcon">
                                                <Icon source={CashDollarMajor} color="base" />
                                            </div>
                                            {/* <image className='cardLogo' src="https://freerangestock.com/thumbnail/140669/baobab-tree-at-sunset--african-landscape--calm--relaxing--tr.jpg" /> */}
                                        </div>
                                    </div>
                                </div>
                                <div className="saleChart">
                                    <ResponsiveContainer width="100%" aspect={2}>
                                        <BarChart
                                            data={saleTabel}
                                            margin={{
                                                top: 50,
                                                right: 30,
                                                left: 20,
                                                bottom: 5,
                                            }}
                                        >
                                            {/* <CartesianGrid strokeDasharray="3 3" opacity={0.5} /> */}
                                            <CartesianGrid opacity={0.2} />
                                            <XAxis dataKey="month"/>
                                            <YAxis dataKey="TotalSaleVolume"/>
                                            <Tooltip />
                                            <Legend />
                                            <Bar dataKey="TotalSaleVolume" fill="#84c89e" />

                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>

                            </div>

                        </div>}
                </Layout>
            </Page>
        </Frame>
    )
}

export default Sale
