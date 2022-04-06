// ==============================|| GET DASHBOARD DATA ||============================== //

export const getXAxisCategories = async () => {
    try {
        const xaxistoreturn = {
            monthly: {
                xaxiscategories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            weekly: {
                xaxiscategories: ['1', '2', '3', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            annually: {
                xaxiscategories: ['2022', '2021', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            }
        };
        return xaxistoreturn;
    } catch (err) {
        console.log(`error getting dashboard data\nerr is: ${err}`);
    }
    return 0;
};

export default getXAxisCategories;
