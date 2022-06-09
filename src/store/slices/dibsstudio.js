// third-party
import { createSlice } from '@reduxjs/toolkit';

// project imports
// import axios from 'utils/axios';
// import { dispatch } from '../index';
// import { useDispatch } from 'react-redux';

// ----------------------------------------------------------------------

const initialState = {
    config: {
        id: 0,
        dibsStudioId: 0,
        accountType: 'studio-admin',
        userEmail: '',
        role: 'admin',
        firstname: '',
        lastname: '',
        financialAccess: false,
        settingsAccess: false
    },
    studioConfig: {
        terms: '',
        color: '',
        intervalEnd: '',
        autopayNotice: '',
        use_spot_booking: '',
        show_credit_load: '',
        first_class_fixed_price: '',
        display_giftcards: '',
        spot_label: '',
        vod_access_period: '',
        imageUrls: {
            color_logo: '',
            hero_url: ''
        },
        salesTax: 0,
        retailTax: 0,
        billing: {
            stripe_account_id: '',
            stripeid: '',
            stripe_cardid: '',
            subscription_fee: '',
            total_monthly_charge: '',
            date_of_charge: ''
        }
    },
    customerService: {
        customerServiceEmail: '',
        customerServicePhone: '',
        customEmailToSendFrom: '',
        address: ''
    },
    settings: {
        dynamicPricing: false,
        flashCredits: false,
        minPrice: 20,
        maxPrice: 30
    },
    integrations: {
        classpass: false,
        gymPass: false,
        cp_amount: 0
    }
};

const dibsstudio = createSlice({
    name: 'dibsstudio',
    initialState,
    reducers: {
        // HAS ERROR
        hasError(state, action) {
            state.error = action.payload;
        },
        // ADD STUDIO DATA
        addStudioData(state, action) {
            state.config = action.payload;
        },
        setClasspass(state, action) {
            state.integrations.classpass = action.payload;
        },
        setDynamicPricing(state, action) {
            state.settings.dynamicPricing = action.payload;
        },
        setFlashCreditsStore(state, action) {
            state.settings.flashCredits = action.payload;
        },
        setGympass(state, action) {
            state.integrations.gympass = action.payload;
        },
        setGlobalPrices(state, action) {
            state.settings.minPrice = action.payload.minPrice;
            state.settings.maxPrice = action.payload.maxPrice;
        },
        setStudioProfileAccountInfo(state, action) {
            state.config.firstName = action.payload.firstName;
            state.config.lastName = action.payload.lastName;
            state.config.email = action.payload.email;
            state.config.phone = action.payload.phone;
        },
        setPaymentInfo(state, action) {
            state.studioConfig.billing = action.payload;
        },
        setGeneralLocationData(state, action) {
            state.customerService.customerServiceEmail = action.payload.serviceEmail;
            state.customerService.customerServicePhone = action.payload.servicePhone;
            state.customerService.address = action.payload.address;
            state.customerService.address2 = action.payload.address2;
            state.customerService.city = action.payload.city;
            state.customerService.state = action.payload.state;
            state.customerService.zipcode = action.payload.zipcode;
            state.studioConfig.salesTax = action.payload.salesTax;
            state.studioConfig.retailTax = action.payload.retailTax;
        },
        setCustomEmailToSendFrom(state, action) {
            state.customerService.customEmailToSendFrom = action.payload;
        },
        setTaxesRedux(state, action) {
            state.studioConfig.salesTax = action.payload.salesTax;
            state.studioConfig.retailTax = action.payload.retailTax;
        },
        setNumDaysToShowCalendar(state, action) {
            console.log(`action payload is: ${JSON.stringify(action.payload)}`);
            state.studioConfig.interval_end = action.payload;
        },
        setRafAwardRedux(state, action) {
            state.studioConfig.raf_award = action.payload;
        },
        setStudioConfigData(state, action) {
            state.studioConfig = action.payload;
        },
        setStudioImageUrls(state, action) {
            state.studioConfig.imageUrls = action.payload;
        },
        setStudioCancelTime(state, action) {
            state.studioConfig.cancelTime = action.payload;
        },
        setStudioColorRedux(state, action) {
            state.studioConfig.color = action.payload;
        }
    }
});

// Reducer
export default dibsstudio.reducer;
export const {
    addStudioData,
    hasError,
    setClasspass,
    setGympass,
    setDynamicPricing,
    setFlashCreditsStore,
    setGlobalPrices,
    setGeneralLocationData,
    setCustomEmailToSendFrom,
    setStudioConfigData,
    setStudioImageUrls,
    setStudioColorRedux,
    setNumDaysToShowCalendar,
    setRafAwardRedux,
    setStudioCancelTime,
    setTaxesRedux,
    setStudioProfileAccountInfo,
    setPaymentInfo
} = dibsstudio.actions;

// ----------------------------------------------------------------------
