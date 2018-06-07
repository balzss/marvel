import React, { Component } from 'react';
import './App.css';

const API_KEY = '937517d8496fc712bbb2e6291ca03b27';

function charactersEndpoint(startsWith) {
    return `https://gateway.marvel.com/v1/public/characters?nameStartsWith=${startsWith}&apikey=${API_KEY}&limit=100`
}

class Card extends Component {
    render() {
        return (
            <div>
                <h3>{(this.props.data || {}).name}</h3>
                <img src={((this.props.data || {}).thumbnail || {}).path + '.jpg'} width="120"/>
            <p>{(this.props.data || {}).description}</p>
                <hr/>
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            results: []
        };
    }

    handleSearchInput(event) {
        const typedQuery = event.target.value;
        this.setState({searchQuery: typedQuery});

        if(typedQuery !== '') {
            this.getSearchResults(typedQuery);
        } else {
            this.setState({results: []});
        }
    }

    getSearchResults(startsWith) {
        fetch(charactersEndpoint(startsWith))
            .then(response => response.json())
            .then(result => {
                this.setState({results: result.data.results});
                console.log(result.data.results);
        });
    }

    createResultList() {
        return this.state.results.map((result, index) => <Card data={result} key={index}/>);
    }

    render() {
        return (
            <div>
            <input type="text" value={this.state.searchQuery} onChange={this.handleSearchInput.bind(this)}/>
            {this.createResultList()}
            </div>
        );
    }
}

export default App;
