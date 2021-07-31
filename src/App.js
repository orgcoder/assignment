import React, { Component } from 'react';
import './App.css';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import { FaGithub, FaGitlab } from 'react-icons/fa';
import Logo from './Logo';
import { Container } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import ExampleA from 'components/ExampleA';
import ExampleB from 'components/ExampleB';

class App extends Component {
    constructor(props) {
        super(props);
        this.githubRepoURL = '#CHANGE ME';
    }

    render() {
        return (
            <>
               
                <Container fluid noGutters>
                    <Container
                        style={{
                            backgroundColor: '#9c9c9c',
                            marginLeft: '10%',
                            marginRight: '10%',
                            maxWidth: '80%',
                            height: 'calc(100vh - 40px)',
                            overflow: 'auto'
                        }}
                    >
                        <ExampleA />
                        <ExampleB />
                    </Container>
                </Container>
            </>
        );
    }
}

export default App;
