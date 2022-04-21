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
    // const [shouldSearch, setShouldSearch] = React.useState(1);
    // console.log('after declaration - shouldSearch: ', shouldSearch);
    const { config } = useSelector((state) => state.dibsstudio);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [countLastSearchTerm, setCountLastSearchTerm] = React.useState(0);
    const [countSearchResults, setCountSearchResults] = React.useState(100);
    const [searchResults, setSearchResults] = React.useState(recents);
    const searchOptions = [];
    React.useEffect(() => {
        // dispatch(clearSearchResults());
        console.log(`\n\n\n\n\ngetting new search results again`);
        getNewSearchResults(config.dibsStudioId, searchTerm).then((result) => {
            console.log(`value from getNewSearchResults: ${JSON.stringify(result)}`);
            if (result !== 0) {
                dispatch(addOrUpdateSearchResults(result));
                console.log(`\n\n\n\n\n\n\n\n
                    current search term is: ${searchTerm}\n
                    the current results from this search term is: ${JSON.stringify(result)}\n
                    \n\n
                    countSearchResults at this time is = ${countSearchResults}`);
                setSearchResults(result);
                setCountSearchResults(result.length);
                // i know that this is not right
                if ((result.length > 0 && result.length <= countSearchResults) || countSearchResults === 100) {
                    setSearchResults(result);
                    setCountSearchResults(result.length);
                }
            }
        });
        // maybe each time the searchterm changes, set new search options based on the results
    }, [config.dibsStudioId, searchTerm, dispatch, countSearchResults]);
    // console.log(`recents: ${JSON.stringify(recents)}`);
    const filterOptions = createFilterOptions({
        stringify: ({ label, email, id, phone }) => `${label} ${email} ${id} ${phone}`
    });
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
    };
    const testResetOfSearch = (valuefromfield) => {
        console.log(`\n\n\n\n\n$$$$$$$$$$\ntestResetOfSearch v2 -->\n
        valuefromfield is: ${valuefromfield}\n
        searchTerm is: ${searchTerm}\n
        count of searchTerm is: ${searchTerm.length}
        countLastSearchTerm is: ${countLastSearchTerm}\n
        countSearchResults is: ${countSearchResults}\n`);
        // test if you're going backwards with the search term
        console.log(`is this true? ${valuefromfield.length} < ${countLastSearchTerm}`);
        if (valuefromfield.length < countLastSearchTerm || countLastSearchTerm === 0) {
            console.log(`valuetotest count is less than the count of last search term`);
            console.log(`going backwards with the searching`);
            setCountSearchResults(100);
            if (valuefromfield.length > 1) {
                setCountLastSearchTerm(valuefromfield.length);
                dispatch(addOrUpdateSearchResults([]));
            }
        }
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
            clearOnEscape
            noOptionsText={nooptionstext}
            onInputChange={(event, value) => {
                console.log(`\n\n\nON INPUT CHANGE value = ${value}`);
                // console.log(`event.target = ${event.target}`);
                setSearchTerm(value);
                testResetOfSearch(value);
                return value;
            }}
            getOptionLabel={({ label }) => {
                const optiontoDisplay = `${label}`;
                return optiontoDisplay;
            }}
            isOptionEqualToValue={(option, value) => {
                console.log(`option equal to value`);
                console.log(`option = ${JSON.stringify(option)}`);
                console.log(`value = ${JSON.stringify(value)}`);
                return option.key === value.key;
                // return option.label === value.label;
            }}
            filterSelectedOptions
            renderOption={(props, option) => {
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
