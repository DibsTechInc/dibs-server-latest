import * as React from 'react';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { shouldForwardProp } from '@mui/system';
import { useSelector, useDispatch } from 'store';
import { addToRecentsSearch, addOrUpdateSearchResults, clearSearchResults } from '../../store/slices/clientsearch';
import { getNewSearchResults } from '../../actions/studios/getNewSearchResults';

const OutlineInputStyle = styled(TextField, { shouldForwardProp })(({ theme }) => ({
    width: 434,
    height: 40,
    size: 'small',
    marginLeft: 0,
    paddingLeft: 6,
    paddingRight: 16,
    '& input': {
        background: 'transparent !important',
        paddingLeft: '4px !important',
        paddingTop: '4px !important',
        paddingBottom: '4px !important'
    },
    [theme.breakpoints.down('lg')]: {
        width: 250
    },
    [theme.breakpoints.down('md')]: {
        width: '100%',
        marginLeft: 4,
        background: theme.palette.mode === 'dark' ? theme.palette.dark[800] : '#fff'
    }
}));

export default function AutocompleteSearch() {
    const dispatch = useDispatch();
    const { results } = useSelector((state) => state.clientsearch);
    const { recents, matches } = results;
    const [shouldSearch, setShouldSearch] = React.useState(1);
    console.log('after declaration - shouldSearch: ', shouldSearch);
    const { config } = useSelector((state) => state.dibsstudio);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [searchResults, setSearchResults] = React.useState([]);
    // console.log(`\n\n\n\n\n@@@@@@@@@@@\nmatches length is: ${matches.length}\n\n\n`);
    const searchOptions = [];
    React.useEffect(() => {
        // dispatch(clearSearchResults());
        console.log(`\n\n\n\n\ngetting new search results again`);
        console.log(`shouldSearch is: ${shouldSearch}`);
        if (shouldSearch === 1) {
            getNewSearchResults(config.dibsStudioId, searchTerm).then((result) => {
                console.log(`value from getNewSearchResults: ${JSON.stringify(result)}`);
                if (result !== 0) {
                    dispatch(addOrUpdateSearchResults(result));
                    setSearchResults(result);
                }
            });
        }
        // maybe each time the searchterm changes, set new search options based on the results
    }, [config.dibsStudioId, searchTerm, dispatch, shouldSearch]);
    // console.log(`recents: ${JSON.stringify(recents)}`);
    const filterOptions = createFilterOptions({
        stringify: ({ label, email, id, phone }) => `${label} ${email} ${id} ${phone}`
    });
    // remove this once you confirm not needed
    // search by phone with 1 in front and without 1 infront
    // const getSearchOptions = () => {
    //     console.log(`searchOptions before setting anything = ${JSON.stringify(searchOptions)}`);
    //     // console.log(`matches.length is ${matches.length}`);
    //     console.log(`recents = ${JSON.stringify(recents)}`);
    //     if (recents && recents.length > 0) {
    //         console.log(`adding data to recents`);
    //         for (let i = 0; i < recents.length; i += 1) {
    //             searchOptions.push(recents[i]);
    //         }
    //     }
    //     if (matches && matches.length > 1) {
    //         console.log(`adding data to matches`);
    //         for (let j = 0; j < matches.length; j += 1) {
    //             console.log(`matches = ${JSON.stringify(matches[j])}`);
    //             searchOptions.push(matches[j]);
    //         }
    //     }
    //     console.log(`\n\n\n\nsearchOptions on client side is: ${JSON.stringify(searchOptions)}`);
    //     return searchOptions;
    // };
    // format telephone number for display
    const renderSuggestion = (suggestion) => (
        <div key={suggestion.key}>
            <span style={{ fontWeight: '450' }}>{suggestion.label}</span>
            <div>
                <span style={{ fontWeight: '300', fontStyle: 'italic' }}>{suggestion.email}</span>
            </div>
            <div>
                <span style={{ fontWeight: '300' }}>{suggestion.phone}</span>
            </div>
        </div>
    );
    const setRecentOptions = (event, value) => {
        console.log(`\n\n\n\n\n$$$$$$$$$$\nChoice was changed -> see below for options`);
        console.log(`event.target = ${event.target}`);
        console.log(`value is ${JSON.stringify(value)}`);
        dispatch(addToRecentsSearch(value));
        setSearchTerm(value.label);
        console.log(`\n\n\n\nrecent options setting shouldSearch back to 1`);
        setShouldSearch(1);
    };
    const nooptionstext = 'No clients were found. You can create a new account for them in the section below.';
    return (
        <Autocomplete
            // id="combo-box-demo"
            autoComplete
            // options={recents}
            options={searchResults}
            filterOptions={filterOptions}
            name="clientSearch"
            noOptionsText={nooptionstext}
            onInputChange={(event) => {
                // console.log(`event.target.value = ${event.target.value}`);
                // console.log(`event.target = ${event.target}`);
                setSearchTerm(event.target.value);
                return event.target;
            }}
            getOptionLabel={({ label }) => {
                const optiontoDisplay = `${label}`;
                return optiontoDisplay;
            }}
            isOptionEqualToValue={(option, value) => {
                console.log(`option equal to value`);
                console.log(`option = ${JSON.stringify(option)}`);
                console.log(`value = ${JSON.stringify(value)}`);
                if (option.key === value.key) {
                    setShouldSearch(0);
                    console.log('just set shouldSearch to false');
                }
                return option.key === value.key;
                // return option.label === value.label;
            }}
            filterSelectedOptions
            renderOption={(props, option) => {
                console.log(`\n\n\n\n\n\n\n\n%%%%%%%%%%\n\nabout to send renderSuggestion this option: ${JSON.stringify(option)}`);
                const htmlForList = renderSuggestion(option);
                return (
                    <li {...props} key={option.id}>
                        {htmlForList}
                    </li>
                );
            }}
            // onChange={setRecentOptions}
            onChange={(event, value) => setRecentOptions(event, value)} // prints the selected value
            // clearOnEscape
            sx={{ py: 0 }}
            renderInput={(params) => <OutlineInputStyle placeholder="Enter name, email, phone # or userid" {...params} />}
        />
    );
}
