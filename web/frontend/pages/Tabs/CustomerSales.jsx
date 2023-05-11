import "../../css/customerSales.css"
import React, { useEffect, useState } from 'react'
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { Layout, Spinner, Page, Frame ,Icon} from "@shopify/polaris"
import { ChevronRightMinor,ChevronLeftMinor } from '@shopify/polaris-icons';

function CustomerSales() {

    const authFetch = useAuthenticatedFetch();

    const [salesArray, setSalesArray] = useState([])
    const [loading, setLoading] = useState(false);
    const [documentCount, setDocumentCount] = useState()
    const [pageCount, setPageCount] = useState(1);

    async function GetAllSales(pageNo) {
        setLoading(true)
        console.log("fetching data")
        const resp = await authFetch(`/api/admin/merchant/performance/sales/${pageNo}`)
        const data = await resp.json()
        console.log("dta is -=-=-==- ", data)
        setSalesArray(data.data);
        console.log("documnet count is ",documentCount)
        setDocumentCount(data.documentCount)
        setLoading(false)
    }
    function previousPage() {
        console.log("pageCount   ", pageCount)
        setPageCount((p) => {
            if (p > 1) {
                document.getElementById("next").disabled = false
                GetAllSales(p - 1)
                return p - 1
            }
            else {
                document.getElementById("Previous").disabled = true
            }
            return p
        })
    }

    function nextPage() {
        console.log("pageCount   ", pageCount, "  have next page  ", pageCount < (documentCount / 10))
        setPageCount((p) => {
            if (p < (documentCount / 10)) {
                document.getElementById("Previous").disabled = false
                GetAllSales(p + 1)
                return p + 1
            }
            else {
                document.getElementById("next").disabled = true
            }
            return p
        })
    }


    useEffect(() => {
        GetAllSales(1)
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
                        <div className="customerSaleParent">
                            <div className="customerSale">
                                <h1>Total Sales Count : {documentCount}</h1>
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
                                        {salesArray?.length <= 0 ?
                                            <tbody>

                                                <tr className='noDataFound'>
                                                    <td colSpan="7"> No Data To Show</td>
                                                </tr>
                                            </tbody>
                                            :
                                            <tbody>
                                                {salesArray?.map((element, index) => {
                                                    console.log("salesArray      ",salesArray)
                                                    return (

                                                        <tr key={index} className="singleColumn">
                                                            <td data-label="S.N" className='indexTD' >{((pageCount-1)*10)+ index + 1}</td>
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
                            <div className="actionBTN">
                                <button onClick={previousPage} id="Previous"> <Icon source={ChevronLeftMinor} color="base" /> Prev </button>
                                <button onClick={nextPage} id="next"> Next <Icon source={ChevronRightMinor} color="base" />  </button>
                            </div>
                        </div>
                    }
                </Layout>
            </Page>
        </Frame>
    )
}

export default CustomerSales
