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

// Recent matches for search
// const recentMatches = [
//     { label: 'Quentin Ferrari', email: 'ferrariquentin@hotmail.fr', phone: '', id: 409536 },
//     { label: 'Kelly Burke', email: 'kellyvbmac@gmail.com', phone: '18454993960', id: 391909 },
//     { label: 'Carly Chadwick', email: 'cchadwick1004@gmail.com', phone: '', id: 234374 },
//     { label: 'Jessica Carlomusto', email: 'jcarlomusto@hotmail.com', phone: '5168137309', id: 367143 },
//     { label: 'Nikki Lombard', email: 'lombardn30@gmail.com', phone: '', id: 409537 },
//     { label: 'Belinda Hetzler', email: 'belinda.hetzler@gmail.com', phone: '3478823125', id: 409541 },
//     { label: 'Gina Jay', email: 'runningcrazy@hotmail.com', phone: '9074561049', id: 378512 },
//     { label: 'Dan Callahan', email: 'callahan.dj@gmail.com', phone: '', id: 111799 },
//     { label: 'Lee crawford', email: 'clc238@outlook.com', phone: '4134456860', id: 409538 },
//     { label: 'Rose Soiffer-Kosins', email: 'rsoiffer@students.pitzer.edu', phone: '', id: 409542 },
//     { label: 'Katherine Sumner', email: 'kcsumner31@gmail.com', phone: '6184078862', id: 409544 },
//     { label: 'Nathan Han', email: 'hnathan@mit.edu', phone: '', id: 350326 },
//     { label: 'Daniel Milaschewski', email: 'danmilaschewski@gmail.com', phone: '', id: 409539 },
//     { label: 'Cathy McAree', email: 'cathynpeter@aol.com', phone: '5162866247', id: 386941 },
//     { label: 'Farah Roessner', email: 'farah.roessner@yahoo.com', phone: '9178255191', id: 375995 },
//     { label: 'Melana Hammel', email: 'mhammel216@gmail.com', phone: '16094337763', id: 391977 },
//     { label: 'Alice Zhang', email: 'polutwo@hotmail.com', phone: '', id: 345511 },
//     { label: 'Joan Cumming', email: 'joancumming2015@gmail.com', phone: '', id: 409540 },
//     { label: 'Brian Deng', email: 'bdeng95@gmail.com', phone: '', id: 409543 },
//     { label: 'Madigan Naylor', email: 'madigan.naylor@gmail.com', phone: '3035790257', id: 409545 },
//     { label: 'alessandra.crocker Crocker', email: 'alessandra.crocker@hotmail.com', phone: '', id: 69165 },
//     { label: 'Rebecca Ahrens', email: 'rebecca.ahrens@gmail.com', phone: '6463824440', id: 109906 },
//     { label: 'Paulo Voigt', email: 'paulo.voightmodel@gmail.com', phone: '', id: 409546 },
//     { label: 'Rochelle Fainchtein', email: 'cfetocpa@gmail.com', phone: '6462384948', id: 409548 },
//     { label: 'Ohm Ratta', email: 'ohm.wathanyoo@gmail.com', phone: '9173740409', id: 354963 },
//     { label: 'Rob Cocks', email: 'rjcocks@gmail.com', phone: '', id: 345475 },
//     { label: 'Allen Hu', email: 'allen.hu@wunderkind.co', phone: '', id: 409547 },
//     { label: 'Emmie Derback', email: 'emd58.gu@gmail.com', phone: '2396995207', id: 409549 },
//     { label: 'Chuck Lin', email: 'chucklin72@gmail.com', phone: '', id: 409561 },
//     { label: 'Steve Gillis', email: 'attysegillis@gmail.com', phone: '19203629701', id: 409556 },
//     { label: 'Trinity Bell', email: 'belltrinity1@gmail.com', phone: '3146519181', id: 390633 },
//     { label: 'Maxime Orsolani', email: 'm.orsolani@gmail.com', phone: '', id: 409554 },
//     { label: 'Mike Spyros', email: 'spyrosmike@gmail.com', phone: '8607486606', id: 409559 },
//     { label: 'Johanna Mermer', email: 'johannamermer@gmail.com', phone: '', id: 409563 },
//     { label: 'Lucas Grieser', email: 'emmie@google.com', phone: '4258948143', id: 409550 },
//     { label: 'Zoe Papacostas', email: 'zopapacostas@gmail.com', phone: '9148156788', id: 409552 },
//     { label: 'Laura Seifert', email: 'laura.michelle.seifert@gmail.com', phone: '', id: 328918 },
//     { label: 'Malina Weissman', email: 'malinaweissman@gmail.com', phone: '9177335371', id: 409560 },
//     { label: 'Stephanie Amend', email: 'steph_mtn@yahoo.com', phone: '8017101252', id: 409562 },
//     { label: 'Giorgio Miraflor', email: 'itsgiorgiomiraflor@gmail.com', phone: '7276378258', id: 386618 },
//     { label: 'Curtter Li', email: 'curtterl@gmail.com', phone: '', id: 409555 },
//     { label: 'Jaime Koumoulis', email: 'jaime.koumoulis@gmail.com', phone: '5166525919', id: 409551 },
//     { label: 'Riddhi Desai', email: 'ridhs1@yahoo.co.in', phone: '', id: 409557 },
//     { label: 'susan Cohen', email: 'sgsbd@aol.com', phone: '6319874536', id: 409553 },
//     { label: 'Danielle DeOrsey', email: 'deorseyd@gmail.com', phone: '', id: 409564 },
//     { label: 'peggy li', email: 'ml2566@nyu.edu', phone: '9177542234', id: 409558 },
//     { label: 'Mike Shin', email: 'mike.shin327@gmail.com', phone: '', id: 409565 },
//     { label: 'Elisa port', email: 'elisa.port@icloud.com', phone: '6463154172', id: 390833 },
//     { label: 'Sybelle Gaubert', email: 'sybellegaubert@gmail.com', phone: '', id: 409573 },
//     { label: 'Morgan Bedsworth', email: 'mcbedsworth@gmail.com', phone: '', id: 345523 },
//     { label: 'Linda Fagrell', email: 'bonsall5@sbcglobal.net', phone: '7603107261', id: 409566 },
//     { label: 'Leslie Milbrett', email: 'milbrettlr@yahoo.com', phone: '9076999000', id: 391352 },
//     { label: 'Abbey Ries', email: 'abbeykries@gmail.com', phone: '', id: 321441 },
//     { label: 'Shirley Chen', email: 'shrleychen@gmail.com', phone: '', id: 132557 },
//     { label: 'Mika Luo', email: 'mikaluoyuting@gmail.com', phone: '', id: 409567 },
//     { label: 'Teri Cuthbert', email: 'terybery2000@yahoo.com', phone: '4174837444', id: 409574 },
//     { label: 'Moha Antani', email: 'email117@example.com', phone: '', id: 394523 },
//     { label: 'Koko Koko', email: 'elente@kokobaz.com', phone: '', id: 409570 },
//     { label: 'Travis Hanson', email: 'jhanson@foursquare.com', phone: '', id: 409575 },
//     { label: 'Haidee ODonnell', email: 'ha1dee@hotmail.co.uk', phone: '', id: 2400 },
//     { label: 'Nikki Walker', email: 'nikkivhwalker@gmail.com', phone: '', id: 409576 },
//     { label: 'Marleni Rodriguez', email: 'marlenierodriguez01@gmail.com', phone: '9173759823', id: 409577 },
//     { label: 'Kaicheng Yu', email: 'newton_yu@hotmail.com', phone: '', id: 409568 },
//     { label: 'Sarah Saladino', email: 'sarah.saladino@yahoo.com', phone: '6317865294', id: 349510 },
//     { label: 'Basirah Rahim', email: 'pd5cz5pxxb@privaterelay.appleid.com', phone: '', id: 409581 },
//     { label: 'Katya Potapov', email: 'kat.p28@gmail.com', phone: '', id: 409571 },
//     { label: 'Wendy Wolfson', email: 'gwendyjane@hotmail.com', phone: '', id: 376520 },
//     { label: 'Jeremy Yang', email: 'jeremyyyang@gmail.com', phone: '6463016956', id: 409578 },
//     { label: 'Julia Renedo', email: 'juliarenedo@gmail.com', phone: '', id: 353596 },
//     { label: 'Alina Crouch', email: 'acrouch@yext.com', phone: '', id: 409582 },
//     { label: 'Isabella Trinidad', email: 'issatrinidad1@gmail.com', phone: '', id: 409572 },
//     { label: 'Karolina Cambani', email: 'karolina.cambani@gmail.com', phone: '', id: 111811 },
//     { label: 'Camila Goldner Perez', email: 'camilagoldner7@gmail.com', phone: '2819612537', id: 409583 },
//     { label: 'Diana Bryson', email: 'dbrysondealing@gmail.com', phone: '8189199366', id: 409579 },
//     { label: 'Sdvdlj fkdifd', email: 'nls@gmail.com', phone: '3427948333', id: 409585 },
//     { label: 'Sharon goldberg', email: 'slb306@gmail.com', phone: '5166600260', id: 389860 },
//     { label: 'Caroline Raiford', email: 'carolineraiford@gmail.com', phone: '6194717056', id: 409586 },
//     { label: 'Alexandra Greer', email: 'alexandra@alexandragreer.com', phone: '', id: 409584 },
//     { label: 'Shelby Quiñones', email: 'shelbyquinones1@gmail.com', phone: '9172837590', id: 389197 },
//     { label: 'Kim Shui', email: 'kshui12@gmail.com', phone: '', id: 229647 },
//     { label: 'Vaughan Ollier', email: 'vedgar24@gmail.com', phone: '', id: 387944 },
//     { label: 'Charlene Thomas', email: 'charct81@gmail.com', phone: '', id: 376243 },
//     { label: 'Egor Titov', email: 'egorny@gmail.com', phone: '9083578854', id: 409602 },
//     { label: 'Courtney Berry', email: 'caberry1014@gmail.com', phone: '', id: 409587 },
//     { label: 'Leo Gott', email: 'gotti_l@msn.com', phone: '', id: 409601 },
//     { label: 'Raymond Zhuang', email: 'rfz777@gmail.com', phone: '', id: 409596 },
//     { label: 'Gisela Hoxha', email: 'giselahoxha1@gmail.com', phone: '', id: 409603 },
//     { label: 'MEL GONZALES', email: 'mel@eboost.com', phone: '', id: 78585 },
//     { label: 'Amina Seay', email: 'aminaseay@me.com', phone: '', id: 409608 },
//     { label: 'Marlena Guttman', email: 'marlenaguttman@gmail.com', phone: '6315602203', id: 355208 },
//     { label: 'David Hu', email: 'david.hu@1stdibs.com', phone: '', id: 409597 },
//     { label: 'Toey Thawaranon', email: 'amiyako10@gmail.com', phone: '', id: 409588 },
//     { label: 'Aida Zuniga', email: 'aida.zuniga.e@gmail.com', phone: '6504070731', id: 409607 },
//     { label: 'Munus Shih', email: 'munusshih@newschool.edu', phone: '', id: 409605 },
//     { label: 'Molly Kestenbaum', email: 'molly.rose.kestenbaum@gmail.com', phone: '9145842479', id: 409609 },
//     { label: 'Lee Harper', email: 'harper.lee@mac.com', phone: '9177413680', id: 409589 },
//     { label: 'Vivian Raquel Valentin', email: 'cvrdnpnt@gmail.com', phone: '3479512111', id: 409598 },
//     { label: 'Racha L', email: 'rladki@gmail.com', phone: '19172134002', id: 396936 },
//     { label: 'Julie Cannold', email: 'jtcannold@gmail.com', phone: '', id: 111853 },
//     { label: 'Vannessa Jackson', email: 'fy5bms6g6g@privaterelay.appleid.com', phone: '', id: 409599 }
// ];

export default function AutocompleteSearch() {
    const dispatch = useDispatch();
    const { results } = useSelector((state) => state.clientsearch);
    const { recents, matches } = results;
    const { config } = useSelector((state) => state.dibsstudio);
    const [searchTerm, setSearchTerm] = React.useState('');
    const searchOptions = [];
    React.useEffect(() => {
        // dispatch(clearSearchResults());
        console.log(`\n\n\n\n\ngetting new search results again`);
        getNewSearchResults(config.dibsStudioId, searchTerm).then((result) => {
            console.log(`value from getNewSearchResults: ${JSON.stringify(result)}`);
            if (result !== 0) {
                dispatch(addOrUpdateSearchResults(result));
            }
        });
        // maybe each time the searchterm changes, set new search options based on the results
    }, [config.dibsStudioId, searchTerm, dispatch]);
    // console.log(`recents: ${JSON.stringify(recents)}`);
    const filterOptions = createFilterOptions({
        stringify: ({ label, email, id, phone }) => `${label} ${email} ${id} ${phone}`
    });
    // remove this once you confirm not needed
    // search by phone with 1 in front and without 1 infront
    const getSearchOptions = () => {
        console.log(`searchOptions before setting anything = ${JSON.stringify(searchOptions)}`);
        // console.log(`matches.length is ${matches.length}`);
        console.log(`recents = ${JSON.stringify(recents)}`);
        if (recents && recents.length > 0) {
            console.log(`adding data to recents`);
            for (let i = 0; i < recents.length; i += 1) {
                searchOptions.push(recents[i]);
            }
        }
        if (matches && matches.length > 1) {
            console.log(`adding data to matches`);
            for (let j = 0; j < matches.length; j += 1) {
                console.log(`matches = ${JSON.stringify(matches[j])}`);
                searchOptions.push(matches[j]);
            }
        }
        console.log(`\n\n\n\nsearchOptions on client side is: ${JSON.stringify(searchOptions)}`);
        return searchOptions;
    };
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
        console.log(`event.target = ${event.target}`);
        console.log(`value is ${JSON.stringify(value)}`);
        dispatch(addToRecentsSearch(value));
        console.log('made it past addToRecentsSearch');
    };
    const nooptionstext = 'No clients were found. You can create a new account for them in the section below.';
    return (
        <Autocomplete
            // id="combo-box-demo"
            autoComplete
            // options={recents}
            options={matches}
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
            filterSelectedOptions
            renderOption={(props, option) => {
                const htmlForList = renderSuggestion(option);
                return (
                    <li {...props} key={option.id}>
                        {htmlForList}
                    </li>
                );
            }}
            onChange={setRecentOptions}
            clearOnEscape
            sx={{ py: 0 }}
            renderInput={(params) => <OutlineInputStyle placeholder="Enter name, email, phone # or userid" {...params} />}
        />
    );
}
