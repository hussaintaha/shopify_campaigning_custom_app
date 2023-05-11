import "../../../../css/PromotionManager/allcampaign.css"
import React, { useEffect, useState } from 'react'
import { useAuthenticatedFetch } from '@shopify/app-bridge-react';
import { Layout, Spinner, CalloutCard, Frame, Page, Icon } from "@shopify/polaris"
import {
    PlusMinor
} from '@shopify/polaris-icons';
function AllCampaigns({ prop }) {


    const authFetch = useAuthenticatedFetch();
    const [campaignData, setCampaignData] = useState({});
    const [loading, setLoading] = useState(false);

    const getList = () => {
        setLoading(true);

        authFetch(`/api/campaigns/getCampaigns`)
            .then((res) => res.json())
            .then((res) => {
                // const data = res;
                setCampaignData(res)
                setLoading(false);
            })
    }

    useEffect(() => {
        getList();
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
                        <Layout.Section>
                            <div className='allCampaign'>
                                <div className="create_campaign_parent">
                                    <button onClick={() => { prop.setSelected({ ...prop.selected, state: 1 }) }} className="createCampaign">
                                        <Icon source={PlusMinor} color="base" />Create Campaign
                                    </button>
                                </div>
                                <div className="campaign_card_collection">
                                    {campaignData?.data?.map((singleCampaign,index) =>
                                    (
                                        <div key={index} className="campaign_card">
                                            <CalloutCard
                                                key={singleCampaign.campaign_code}
                                                title={`${singleCampaign.campaign_name}`}
                                                illustration={`api/getThumbnail/${singleCampaign.campaign_thumbnail}`}
                                                // illustration={}
                                                primaryAction={{
                                                    content: 'Update Campaign',
                                                    url: '#',
                                                    onAction: () => {
                                                        prop.setSelected({ state: 1, id: singleCampaign._id })
                                                    }

                                                }}
                                            >
                                                <p>{`Code: ${singleCampaign.campaign_code}`}</p>
                                            </CalloutCard>
                                        </div>
                                    ),
                                    )}
                                    </div>
                            </div>
                        </Layout.Section>
                    }
                </Layout>
            </Page>
        </Frame>
    )
}

export default AllCampaigns