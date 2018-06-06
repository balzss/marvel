import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {

    state = {
        contacts: []
    };

    componentDidMount() {
        fetch('https://gateway.marvel.com/v1/public/characters?nameStartsWith=th&apikey=937517d8496fc712bbb2e6291ca03b27')
            .then(response => response.json()).then(result => {
                console.log(result);
        });

    }

    render() {
        return (
            <h1>hello world</h1>
        );
    }
}

export default App;
