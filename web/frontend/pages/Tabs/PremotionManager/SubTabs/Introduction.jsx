import "../../../../css/PromotionManager/introduction.css"
import React, { useEffect, useState } from 'react'
import { useAuthenticatedFetch } from "@shopify/app-bridge-react"
import { Frame, Layout, Page, Spinner, Icon } from '@shopify/polaris';
import {
    CircleAlertMajor
} from '@shopify/polaris-icons';

function Introduction() {

    const [loading, setLoading] = useState(false)
    const [link, setLink] = useState("")
    const authFetch = useAuthenticatedFetch();

    async function findCurrentThemeID() {
        setLoading(true)
        const resp = await authFetch("/api/admin/merchant/themeID")
        const themeArray = await resp.json();
        getThemeID(themeArray.data.themArray, themeArray.data.shop)
        // console.log("trheme Array ", themeArray)
    }

    function getThemeID(dtaArray, shopName) {
        for (let singelData of dtaArray) {
            console.log("singelData ", singelData)
            if (singelData.role === "main") {
                // console.log("inside if")
                // console.log("link is -=-=    " + `https://admin.shopify.com/store/${shopName}/themes/${singelData.id}/editor`)
                document.getElementById("EditTheme").setAttribute("href", `https://admin.shopify.com/store/${shopName}/themes/${singelData.id}/editor`)
                return
            }
        }
    }

    async function getPromoLink() {
        const resp = await authFetch("/api/admin/merchant/promo/link")
        console.log("resp ")
        const data = await resp.json()
        console.log("data   -=- = = ", data)
        setLink(data?.promoLink)
        console.log(data.promoLink)
        setLoading(false)
    }

    useEffect(() => {
        findCurrentThemeID()
        getPromoLink()
    }, [])
    return (
        <Frame>
            <Page narrowWidth>
                <Layout>
                    {loading ?
                        <div className="spinnerContainer">
                            <Spinner accessibilityLabel="Spinner example" size="large" />
                        </div>
                        :
                        <Layout.Section >
                            <div className="instructionBox">
                                <a href="https://www.youtube.com/watch?v=goy4lZfDtCE&ab_channel=Fireship" target="blank">
                                    <div className="videoContainer">
                                        {/* <iframe width="100%" height="345" src={link} frameborder="0" allowfullscreen /> */}
                                    </div>
                                </a>
                                <div className="warningInfo">
                                    <Icon source={CircleAlertMajor} color="base" />
                                    <h1> Please WATCH the video to Setup </h1>
                                </div>

                                <a className="linkToEditor" target="_blank" id='EditTheme' href="" >Go to the Edit Theme</a>
                            </div>
                        </Layout.Section>}
                </Layout>
            </Page>
        </Frame>
    )
}

export default Introduction
