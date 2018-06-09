import React, { Component } from 'react';
import './App.css';
import fuzzySearch from 'fuzzysearch';

const API_KEY = '937517d8496fc712bbb2e6291ca03b27';
const LOREM_IPSUM = 'Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero\'s De Finibus Bonorum et Malorum for use in a type specimen book.';

function stripHtml(html){
    const tmpElem = document.createElement('div');
    tmpElem.innerHTML = html;
    return tmpElem.textContent || tmpElem.innerText || LOREM_IPSUM;
}

class Card extends Component {
    render() {
        return (
            <div className="card">
                <div className="img-container">
                    <img alt="character avatar" src={((this.props.data || {}).thumbnail || {}).path + '.jpg'}/>
                </div>
                <div className="right-side">
                    <h3 className="hero-name">{(this.props.data || {}).name}</h3>
                    <p className="details">{stripHtml((this.props.data || {}).description)}</p>
                    <div className="button-row">
                        <div className="button style1">
                            <div className="text">
                                comics
                            </div>
                        </div>
                        <div className="button">
                            <div className="text">
                                stories
                            </div>
                        </div>
                        <div className="button">
                            <div className="text">
                                wiki
                            </div>
                        </div>
                    </div>
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
            document.querySelector('.spinner i').style.display = 'none';
        }

        this.setState({searchQuery: typedQuery});
    }

    async getSearchResults(startsWith) {

        document.querySelector('.spinner i').style.display = 'block';

        const endPoint = 'https://gateway.marvel.com/v1/public/' +
            `characters?nameStartsWith=${startsWith}&apikey=${API_KEY}&`;

        let i = 0;
        while(true) {

            const currentPageSize = i > 0 ? 50 : 5;
            const offet = i > 0 ? (i-1) * 50 + 5: 0;

            const retVal = await fetch(endPoint + `limit=${currentPageSize}&offset=${offet}`)
                .then(response => response.json())
                .then(result => {
                    return result.data;
            });
            console.log(retVal.results);

            if(!this.state.searchQuery.startsWith(startsWith)) break;

            this.setState({initResults: [...this.state.initResults, ...retVal.results]});

            document.querySelector('.spinner i').style.display = 'none';

            if(retVal.count < currentPageSize) break;

            i++;
        }

    }

    createResultList() {
        return this.state.initResults
            .filter(r => {
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
                    <input type="text" value={this.state.searchQuery} onChange={this.handleSearchInput.bind(this)} placeholder="Search for a character..."/>
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
