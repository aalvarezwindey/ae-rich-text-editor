import React, {Component} from 'react';
import './App.css';
import RichText from './rich-text-manipulator/RichText';

class App extends Component {
    render() {
        return (
            <div className="App">
                <header>
                    <span>Simple Text Editor</span>
                </header>
                <main>
                    <RichText />
                </main>
            </div>
        );
    }
}

export default App;
