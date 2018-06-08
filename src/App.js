import React, { Component } from 'react';
import './App.css';

const API_KEY = '937517d8496fc712bbb2e6291ca03b27';

var heroes = [];

async function getCharactersByLetter(startsWith, offset = 0) {
    const endPoint = 'https://gateway.marvel.com/v1/public/' + `characters?nameStartsWith=${startsWith}&apikey=${API_KEY}&limit=100&offset=${offset}`;

    const retVal = await fetch(endPoint)
        .then(response => response.json())
        .then(result => {
            return result.data;
    });

    console.log(retVal);

    if(retVal.count >= 100) {
        console.log('if ag');
        const next = await getCharactersByLetter(startsWith, offset + 100);
        return [...retVal.results, ...next];
    } else {
        return retVal.results;
    }
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
            results: [],
            heroes: []
        };
    }

    handleSearchInput(event) {
        const typedQuery = event.target.value;
        this.setState({searchQuery: typedQuery});

        if(typedQuery.length === 1) {
            this.getSearchResults(typedQuery);
        } else if (typedQuery.length === 0) {
            this.setState({results: []});
        }
    }

    async getSearchResults(startsWith) {
        const endPoint = 'https://gateway.marvel.com/v1/public/' +
            `characters?nameStartsWith=${startsWith}&apikey=${API_KEY}&limit=100&offset=`;

        this.setState({results: []});

        let i = 0;
        while(true) {
            const retVal = await fetch(endPoint + (i * 100))
                .then(response => response.json())
                .then(result => {
                    return result.data;
            });
            this.state.results.push(...retVal.results);
            this.setState({results: [...this.state.results, ...retVal.results]});
            console.log(this.state.results);

            if(retVal.count < 100) break;

            i++;
        }
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
