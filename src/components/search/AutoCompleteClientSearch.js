import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { shouldForwardProp } from '@mui/system';
import { useSelector, useDispatch } from 'store';
import { addToRecentsSearch, addOrUpdateSearchResults } from '../../store/slices/clientsearch';
import { setCurrentClientProfileStudioAdmin } from '../../store/slices/currentclient';
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
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { results } = useSelector((state) => state.clientsearch);
    const { userid } = useSelector((state) => state.currentclient);
    const { recents } = results;
    const { config } = useSelector((state) => state.dibsstudio);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [countLastSearchTerm, setCountLastSearchTerm] = React.useState(0);
    const [countSearchResults, setCountSearchResults] = React.useState(100);
    const [searchResults, setSearchResults] = React.useState(recents);
    const [searchedUserid, setSearchedUserid] = React.useState(5);
    // const searchOptions = [];
    React.useEffect(() => {
        getNewSearchResults(config.dibsStudioId, searchTerm)
            .then((result) => {
                if (result !== 0) {
                    dispatch(addOrUpdateSearchResults(result));
                    setSearchResults(result);
                    setCountSearchResults(result.length);
                }
            })
            .then(() => {
                if (searchedUserid > 5) {
                    console.log(`searcheduserid is ${searchedUserid}`);
                    const urltolink = `/front-desk/clients/${searchedUserid}`;
                    console.log(`urltolink: ${urltolink}`);
                    navigate(urltolink);
                }
            });
        return () => {
            setSearchedUserid(5);
        };
    }, [config.dibsStudioId, searchTerm, dispatch, countSearchResults, searchedUserid, navigate]);
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
                <span style={{ fontWeight: '300' }}>{suggestion.phonelabel}</span>
            </div>
        </div>
    );
    const setRecentOptions = (event, value) => {
        dispatch(addToRecentsSearch(value));
        setSearchTerm(value.label);
        setSearchedUserid(value.id);
        console.log(`setting recent options about to set client profile`);
        dispatch(setCurrentClientProfileStudioAdmin(value));
        console.log(`set currentclient in redux to value: ${JSON.stringify(value)}`);
    };
    const testResetOfSearch = (valuefromfield) => {
        if (valuefromfield.length < countLastSearchTerm || countLastSearchTerm === 0) {
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
                setSearchTerm(value);
                testResetOfSearch(value);
                return value;
            }}
            getOptionLabel={({ label }) => {
                const optiontoDisplay = `${label}`;
                return optiontoDisplay;
            }}
            isOptionEqualToValue={(option, value) => option.key === value.key}
            filterSelectedOptions
            renderOption={(props, option) => {
                const htmlForList = renderSuggestion(option);
                return (
                    <li {...props} key={option.id}>
                        {htmlForList}
                    </li>
                );
            }}
            onChange={(event, value) => setRecentOptions(event, value)}
            sx={{ py: 0 }}
            renderInput={(params) => <OutlineInputStyle placeholder="Enter name, email, phone # or userid" {...params} />}
        />
    );
}
