import {
  Page,
  Layout,
  DatePicker,
  TextField,
  DropZone,
  MediaCard,
  Form,
  FormLayout,
  Button,
  InlineError,
  Spinner,
  Thumbnail,
  Badge,
  Toast,
  Frame,
  CalloutCard
} from "@shopify/polaris";
import "../../../../css/PromotionManager/createCampaign.css"
import { useState, useCallback, useReducer, useEffect } from "react";
import { campaignReducer, initialState } from "../../../../StateLogic/campaignReducer";
import { useAuthenticatedFetch } from "@shopify/app-bridge-react";

export default function CreateCampaign({ prop }) {



  const [state, dispatch] = useReducer(campaignReducer, initialState);


  //Shopify custom feth method to make Oauth request 
  const authFetch = useAuthenticatedFetch();


  const [loading, setLoading] = useState(false);
  // const [currentData,setCurrentData] = useState({});  
  const currentDate = new Date();
  const dissableDateBefore = new Date();
  const dissableDateAfter = new Date();
  dissableDateBefore.setDate(currentDate.getDate() - 1);
  dissableDateAfter.setDate(currentDate.getDate() + 7)
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  const [{ popUpState, popUpValue }, setActivePopUp] = useState({ popUpState: false, popUpValue: "" });
  const [errorMsg, setError] = useState({});
  const [files, setFiles] = useState([]);
  const [{ month, year }, setDate] = useState({ month: currentMonth, year: currentYear });
  const [selectedDates, setSelectedDates] = useState({
    start: new Date(currentDate),
    end: new Date(currentDate),
  });

  //Logic for IMAGE field

  const validImageTypes = ["image/gif", "image/jpeg", "image/png"];

  const handleDropZoneDrop = useCallback(
    (_dropFiles, acceptedFiles, _rejectedFiles) => {
      setFiles(acceptedFiles)

      if (validImageTypes.includes(acceptedFiles[0].type)) {
        dispatch({
          type: "thumbnail",
          payload: {
            name: "campaign_thumbnail",
            value: acceptedFiles[0]
          }
        })
      }
    },
    []
  );

  const fileUpload = !files.length && <DropZone.FileUpload />;


  const uploadedFiles = files.length > 0 && (

    <div style={{ padding: "0" }}>

      <MediaCard
        title="Campaign Thumbnail"
        name="campaign_thumbnail"
        // description={files[0].name}
        // popoverActions={[{ content: "Dismiss", onAction: () => {} }]}
        size="large"
      >
        <img
          alt=""
          width="100%"
          height="100%"
          name="campaign_thumbnail"
          // type="file"
          style={{ objectFit: "cover", objectPosition: "center", padding: ".5rem" }}
          src={window.URL.createObjectURL(files[0])}
        />

      </MediaCard>
    </div>
  );

  // Logic for the campaign name
  const handleNameChange = (campaign_name) => {
    dispatch({
      type: "changeName",
      payload: {
        name: "campaign_name",
        value: campaign_name
      }
    })
  }

  //Logic for campaign code
  const handleCodeChange = (code) => {
    dispatch({
      type: "changeCode",
      payload: {
        name: "campaign_code",
        value: code
      }
    })

  }

  //instruction message shared on the message
  const handleInstructionChange = (instruction) => {
    dispatch({
      type: "instruction",
      payload: {
        name: "campaign_instructions",
        value: instruction
      }
    })

  }

  // it will be the text on the button
  const handleBtnTextChange = (btnText) => {
    dispatch({
      type: "btnText",
      payload: {
        name: "campaign_btn_txt",
        value: btnText
      }
    })

  }

  //it will be the disocunt percentage
  const handleDiscountChange = (discount) => {
    dispatch({
      type: "discount",
      payload: {
        name: "campaign_discount",
        value: discount
      }
    })

  }

  //Logic for date
  const handleMonthChange = useCallback(
    (month, year) => setDate({ month, year }),
    []
  );

  // Logic for handel min share cout
  const handleShareChange = (count) => {
    if (count > 0) {
      dispatch({
        type: "count",
        payload: {
          name: "campaign_spread",
          value: count
        }
      })
    }
  }

  //logic for the date changer
  const handleDateChange = (date) => {
    dispatch({
      type: "campaignDate",
      payload: {
        name: "campaign_date",
        value: date
      }
    })
    setSelectedDates({ ...selectedDates, "start": date.start, "end": date.end })
  }

  //Logic for campaign creation
  const handleCampaignCreation = async () => {
    const validateTemp = validateCampaignData(state)
    console.log("handel create " ,validateTemp)
    setError(validateTemp);

    if (!Object.keys(validateTemp).length > 0) {

      const formBody = new FormData()
      formBody.append('campaign_thumbnail', state?.campaign_thumbnail)
      formBody.append('title', state?.campaign_name)
      formBody.append('code', state?.campaign_code)
      formBody.append("dateStart", state?.campaign_date.start)
      formBody.append("dateEnd", state?.campaign_date.end)
      formBody.append("spread", state?.campaign_spread)

      authFetch(`/api/campaigns/createCampaign/`, {
        method: "POST",
        body: formBody
      })
        .then((res) => {

          return res.ok ? prop.setSelected({ ...prop.selected, state: 2 }) : res.json()
        })
        .then((res) => {

          setActivePopUp({ popUpState: true, popUpValue: res.message })
          setTimeout(() => {
            setActivePopUp({ popUpState: false, popUpValue: "" })
            prop.setSelected({ ...prop.selected, state: 2 })
          },
            3000)

        }).catch((err) => { console.log("errrr --------- ", err) })
    }
  }

  //validating the input and checking for the 
  function validateCampaignData(formData) {
    const errBox = {};

    if (!state?.campaign_url?.availabel) {
      if (files.length <= 0) {
        errBox.thumbnailErr = "Please select a campaign  thumbnail"
      } else if (!validImageTypes.includes(files[0].type)) {
        errBox.thumbnailErr = "Only png jpeg and gif allowed"
      }
    }
    if (formData.campaign_name.length < 5) {
      errBox.campaignNameErr = "Campaign name should be greater 5 charecter"
    }
    else if (formData.campaign_name.length > 35) {
      errBox.campaignNameErr = "Campaign name can't be greater then 35 charecter"
    }
    if (formData.campaign_code.length < 5) {
      errBox.campaignCodeErr = "Campaign code should be greater then be 5 charecter"
    }
    else if (formData.campaign_code.length >= 15) {
      errBox.campaignCodeErr = "Campaign name can't be greater then 15 charecter"
    }
    if (formData.campaign_instructions.length < 15) {
      errBox.campaign_instructionsErr = "Campaign share instruction should be greater then 15 charecter"
    }
    if (formData.campaign_btn_txt.length < 3) {
      errBox.campaign_btn_txtErr = "Campaign share button text should be atleast 3 charecter"
    }
    if (formData.campaign_discount < 5) {
      errBox.campaign_discountErr = "Campaign discount should be atleast 5% OFF"
    }
    else if(formData.campaign_discount > 100){
      errBox.campaign_discountErr = "Campaign discount can't be greater then 100% OFF"
    }
    
    return errBox;
  }

  const handleCampaignUpdate = async () => {

    console.log("update data ",state)

    const validateTemp = validateCampaignData(state)
    setError(validateTemp);

    if (!Object.keys(validateTemp).length > 0) {
      const formBody = new FormData()
      formBody.append('campaign_thumbnail', files[0])
      formBody.append('title', state?.campaign_name)
      formBody.append('code', state?.campaign_code)
      formBody.append("dateStart", state?.campaign_date.start)
      formBody.append("dateEnd", state?.campaign_date.end)
      formBody.append("spread", state?.campaign_spread)
      formBody.append("campaign_instructions", state?.campaign_instructions)
      formBody.append("campaign_btn_txt", state?.campaign_btn_txt)
      formBody.append("campaign_discount", state?.campaign_discount)



      authFetch(`/api/campaigns/updateCampaign/${prop.selected.id}`, {
        method: "PUT",
        body: formBody
      })
        .then((res) => res.json())
        .then((res) => {
          setActivePopUp({ popUpState: true, popUpValue: res.message })
          setTimeout(() => {
            setActivePopUp({ popUpState: false, popUpValue: "" })
            prop.setSelected({ ...prop.selected, state: 2 })

          },
            2000)
        })
    }
  }

  async function fill_this_detail() {
    console.log("pros are ", prop)
    if (prop?.selected.id) {
      setLoading(true)
      try {
        authFetch(`/api/campaigns/automated_campaignCall/${prop.selected.id}`)
          .then((res) => res.json())
          .then(result => {

            dispatch({
              type: "fill_this_detail",
              payload: {
                name: "fill_this_detail",
                value: result.data
              }
            })
            // setCurrentData(state?.campaign_date)
          })
      }
      catch (err) {
        console.log(err)
      }
      setLoading(false)


    }
  }

  useEffect(() => {

    fill_this_detail()

  }, [])

  // onDismiss={setTimeout(() => { setActivePopUp({ popUpState: false, popUpValue: "" }) }, 1000)}

  const toastMarkup = popUpState ? (
    <Toast content={popUpValue} error />
  ) : null;

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
              <div className="create_campaign_div">
                {/* <div className="previewCard">
                  <div className="campaign_card">
                    <img src="${state?.campaign_thumbnail}" alt="" />
                  </div>
                </div> */}
                <Form onSubmit={handleCampaignCreation} enctype="multipart/form-data" >
                  <FormLayout>
                    {
                      typeof state?.campaign_thumbnail == "string" && prop?.selected.id ?
                        <div div className="preview">
                          <div>
                            <div className="preview_innerDiv">
                              <h1>Campaign Name :-</h1>
                              <h1>{state?.campaign_name}</h1>
                            </div>
                            <div className="preview_innerDiv">
                              <h1>Campaign Spread :-</h1>
                              <h1>{state?.campaign_spread}</h1>
                            </div>
                          </div>
                          <div className="duration">
                            <h1>Campaign Duration</h1>
                            <Badge
                              status="success"
                              progress="complete"
                              statusAndProgressLabelOverride="Status: Published. Your online store is visible."
                            >
                              {`Start: ${((new Date(state?.campaign_date?.start))).toLocaleDateString()}`}
                            </Badge>
                            <Badge
                              status="Partial"
                              progress="complete"
                              statusAndProgressLabelOverride="Status: Published. Your online store is visible."
                            >
                              {`End: ${((new Date(state?.campaign_date?.end))).toLocaleDateString()}`}
                            </Badge>
                          </div>

                          <Thumbnail
                            source={state?.campaign_thumbnail}
                            alt="Black choker necklace"
                            size="large"
                          />


                        </div> : ""
                    }
                    <InlineError message={errorMsg?.thumbnailErr} fieldID="myFieldID" />
                    <div className="single_container">
                      <lable className="left_section" >Add File</lable>
                      <DropZone onDrop={handleDropZoneDrop} allowMultiple={false}>
                        {uploadedFiles}
                        {fileUpload}
                      </DropZone>
                    </div>

                    
                      <InlineError message={errorMsg?.campaignNameErr} fieldID="myFieldID" />
                    <div className="single_container">
                      <lable className="left_section" >Campaign Name</lable>
                      <TextField
                        value={state?.campaign_name}
                        name="campaignName"
                        onChange={handleNameChange}
                        autoComplete="off"
                        placeholder="Share The Love Promo"
                      />
                    </div>

                    <InlineError message={errorMsg?.campaignCodeErr} fieldID="myFieldID" />
                    <div className="single_container">
                      <lable className="left_section" >Campaign Code</lable>
                      <TextField
                        value={state?.campaign_code}
                        name="campaignCode"
                        onChange={handleCodeChange}
                        autoComplete="off"
                        placeholder="Enter Unique Campaign Code"
                      />
                    </div>

                    <InlineError message={errorMsg?.campaign_instructionsErr} fieldID="myFieldID" />
                    <div className="single_container">
                      <label className="left_section">Share Instruction</label>
                      <TextField
                        value={state?.campaign_instructions}
                        name="campaignCode"
                        onChange={handleInstructionChange}
                        autoComplete="off"
                        placeholder="Enter Share Message"
                      /></div>

                    <InlineError message={errorMsg?.campaign_btn_txtErr} fieldID="myFieldID" />
                    <div className="single_container">
                      <lable className="left_section" >Button Text</lable>
                      <TextField
                        value={state?.campaign_btn_txt}
                        name="campaignCode"
                        onChange={handleBtnTextChange}
                        autoComplete="off"
                        placeholder="Enter Button Text 'Share Spread'"
                      /></div>

                    <InlineError message={errorMsg?.campaign_discountErr} fieldID="myFieldID" />
                    <div className="single_container">
                      <lable className="left_section" >Discount (%)</lable>
                      <TextField
                        value={state?.campaign_discount}
                        name="campaignCode"
                        onChange={handleDiscountChange}
                        autoComplete="off"
                        placeholder="Discount Percent in number Ex:- 20"
                      /></div>

                    {/* Remove this section after changes */}



                    {/* This section below show the start and end date */}
                    {/* {prop?.selected.id ?
                      <div className="single_container">
                        <Badge
                          status="success"
                          progress="complete"
                          statusAndProgressLabelOverride="Status: Published. Your online store is visible."
                        >
                          {`Start: ${state?.campaign_date?.start}`}
                        </Badge>
                        <Badge
                          status="Partial"
                          progress="complete"
                          statusAndProgressLabelOverride="Status: Published. Your online store is visible."
                        >
                          {`End: ${(state?.campaign_date?.end)}`}
                        </Badge>
                      </div>
                      : ""
                    } */}
                    <div className="single_container">
                      <lable className="left_section" >Select Promotion Period</lable>
                      <DatePicker
                        month={month}
                        year={year}
                        // onChange={setSelectedDates}
                        onChange={handleDateChange}
                        onMonthChange={handleMonthChange}
                        selected={selectedDates}
                        disableDatesBefore={dissableDateBefore}
                        disableDatesAfter={dissableDateAfter}
                        allowRange={true}
                        multiMonth={false}
                      />
                    </div>

                    <InlineError message={errorMsg?.endDateErr} fieldID="myFieldID" />
                    <div className="single_container">
                      <label>MIN Share Quantity</label>
                      <TextField
                        type="number"
                        value={state?.campaign_spread}
                        onChange={handleShareChange}
                        autoComplete="off"
                      /></div>

                    <InlineError message={errorMsg?.shareCountErr} fieldID="myFieldID" />
                    {!prop.selected.id ? <Button submit >Create Campaign</Button> :
                      <Button onClick={handleCampaignUpdate} >Update Campaign</Button>}
                  </FormLayout>

                </Form>
              </div>
              {toastMarkup}
            </Layout.Section>
          }
        </Layout>

      </Page>
    </Frame>
  )
}