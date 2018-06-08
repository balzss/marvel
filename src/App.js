import React, { Component } from 'react';
import './App.css';
import fuzzySearch from 'fuzzysearch';

const API_KEY = '937517d8496fc712bbb2e6291ca03b27';
const PAGE_SIZE = 10;

class Card extends Component {
    render() {
        return (
            <div className="card">
                <div className="img-container">
                    <img alt="anyad" src={((this.props.data || {}).thumbnail || {}).path + '.jpg'}/>
                </div>
                <div className="right-side">
                    <h3 className="hero-name">{(this.props.data || {}).name}</h3>
                    <p className="details">{(this.props.data || {}).description}</p>
                </div>
            </div>
        );
    }
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchQuery: '',
            initResults: []
        };
    }

    handleSearchInput(event) {
        const typedQuery = event.target.value;

        if(typedQuery.length === 1 && this.state.searchQuery === '') {
            this.getSearchResults(typedQuery);
        } else if (typedQuery.length === 0) {
            this.setState({initResults: []});
        }

        this.setState({searchQuery: typedQuery});
    }

    async getSearchResults(startsWith) {

        document.querySelector('.spinner i').style.display = 'block';

        const endPoint = 'https://gateway.marvel.com/v1/public/' +
            `characters?nameStartsWith=${startsWith}&apikey=${API_KEY}&limit=${PAGE_SIZE}&offset=`;

        let i = 0;
        while(true) {
            const retVal = await fetch(endPoint + (i * PAGE_SIZE))
                .then(response => response.json())
                .then(result => {
                    return result.data;
            });
            this.setState({initResults: [...this.state.initResults, ...retVal.results]});
            console.log(this.state.initResults);

            document.querySelector('.spinner i').style.display = 'none';
            if(retVal.count < PAGE_SIZE) break;

            i++;
        }

    }

    createResultList() {
        return this.state.initResults
            .filter(r => {
                // return r.name.toLowerCase().startsWith(this.state.searchQuery.toLowerCase());
                return fuzzySearch(this.state.searchQuery.toLowerCase(), r.name.toLowerCase());
            }).map((result, index) => {
                return (<Card data={result} key={index}/>);
            });
    }

    render() {
        return (
            <div className="container">
                <div className="search-bar">
                    <i className="fas fa-search"></i>
                    <input type="text" value={this.state.searchQuery} onChange={this.handleSearchInput.bind(this)}/>
                </div>
                <div className="spinner">
                    <i className="fas fa-spinner"></i>
                </div>
                {this.createResultList()}
            </div>
        );
    }
}

export default App;
