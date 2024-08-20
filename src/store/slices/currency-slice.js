const { createSlice } = require('@reduxjs/toolkit');

const currencySlice = createSlice({
    name: "currency",
    initialState: {
        currencySymbol: "$",
        currencyName: "USD",
        currencyRate: 1
    },
    reducers: {
        setCurrency(state, action) {
            const currencyName = action.payload;

            if (currencyName === "USD") {
                return state = {
                    currencySymbol: "$",
                    currencyRate: 1,
                    currencyName
                };
            }
        }
    },
});

export const { setCurrency } = currencySlice.actions;
export default currencySlice.reducer;
