export const initialState = {
    campaign_thumbnail: "",
    campaign_name: "",
    campaign_code: "",
    campaign_date: {},
    campaign_spread: "3",
    campaign_instructions: "",
    campaign_btn_txt: "",
    campaign_discount: "",
    campaign_url: { availabel: false, autoReload: false }
}

export const campaignReducer = (state, action) => {
    switch (action.type) {
        case "changeName":
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        case "changeCode":
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        case "thumbnail":
            return {
                ...state,
                [action.payload.name]: action.payload.value
            }

        case "campaignDate":
            return {
                ...state,
                [action.payload.name]: { start: action.payload.value.start, end: action.payload.value.end }
            };
        case "count":
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        case "instruction":
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        case "btnText":
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };
        case "discount":
            return {
                ...state,
                [action.payload.name]: action.payload.value
            };

        case "reset_to_default":
            return {
                ...state, ...initialState, "campaign_date": { end: new Date() },
                campaign_url: { availabel: false, autoReload: true }
            };

        case "fill_this_detail":
            console.log("payload ", action.payload.value)
            return {
                ...initialState, ...action.payload.value,
                campaign_thumbnail: `api/getThumbnail/${action.payload.value.campaign_thumbnail}`,
                campaign_url: { availabel: true, autoReload: true }
            }
        default:
            console.log("ntg to change")
            return { ...state }
    }
}