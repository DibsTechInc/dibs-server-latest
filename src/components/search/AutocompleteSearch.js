import React from 'react';
import PropTypes from 'prop-types';
import Autosuggest from 'react-autosuggest';

const getSuggestionValue = (value) => {
    if (!value) return '';
    return `${value.firstName} ${value.lastName}`;
};

const AutocompleteSearch = (props) => {
    const [valuetoreturn, setValuetoreturn] = React.useState('');
    return <Autosuggest getSuggestionValue={getSuggestionValue} />;
};
export default AutocompleteSearch;
