import React from 'react'
import Autosuggest from 'react-autosuggest';

const getSuggestionValue = suggestion => suggestion;

const renderSuggestion = suggestion => (
    <div>
        {suggestion}
    </div>
);

export default class SearchBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            suggestions: []
        };
    }

    onChange = (event, { newValue }) => {
        this.props.updateQueryText(newValue);
        this.setState({
            value: newValue
        });
    };

    onSuggestionsFetchRequested = ({ value }) => {
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Basic ' + Buffer.from(process.env.REACT_APP_USERNAME + ':' + process.env.REACT_APP_PASSWORD).toString('base64')
            },
            body: JSON.stringify({
                "suggest": {
                    "search-suggest" : {
                        "prefix" : value,
                        "completion" : {
                            "field" : "name_suggest",
                            "size": 10
                        }
                    }
                }
            })
        };

        fetch('/api/_search', requestOptions)
            .then(response => response.json())
            .then(data => this.setState({
                suggestions: data.suggest["search-suggest"][0].options.map(item => item.text)
            }));
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    render() {
        const { value, suggestions } = this.state;

        const inputProps = {
            placeholder: 'Search for anything...',
            id: "search",
            type: "search",
            value,
            onChange: this.onChange,
            onKeyDown: this.props.handleKeyDown,
        };

        return (
            <Autosuggest
                suggestions={suggestions}
                onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                getSuggestionValue={getSuggestionValue}
                renderSuggestion={renderSuggestion}
                inputProps={inputProps}
            />
        );
    }
}