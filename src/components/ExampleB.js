import React, { Component } from 'react';
import './visWidgetConfig.css';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { getPaperById } from '../network/networkRequests';
import axios from 'axios';

var doi_pdf = "";
var doi_url = "";

class ExampleB extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true
        };
    }

    componentDidMount() {
        // fetch data
        this.getData();
        axios.get(`https://api.crossref.org/works/10.1145/3360901.3364435`)
            .then(res => {
                const data = res.data;
                doi_pdf = data.message.link[0].URL;
                doi_url = data.message.URL;
                console.log(doi_pdf)
            })
    }

    getData = () => {
        getPaperById('R8186').then(dataFrame => {
            this.setState({ requestedData: dataFrame, loading: false });
        });
    };

    renderData = () => {
        // create an authors array;
        const authorStatements = this.state.requestedData.statementsData.content.filter(item => item.predicate.id === 'P27');
        const doiStatement = this.state.requestedData.statementsData.content.filter(item => item.predicate.id === 'P26');
        let doiValue = '';
        if (doiStatement[0] && doiStatement[0].object) {
            doiValue = doiStatement[0].object.label;
        }
        if (!this.state.requestedData) {
            return <div>Some error</div>;
        } else {
            return (
                <div>
                    <div>
                        Title: <b>{this.state.requestedData.resourceMetaData.label}</b>;
                    </div>
                    <div>
                        Authors:{' '}
                        {authorStatements.map(item => {
                            return item.object.label + '; ';
                        })}
                    </div>

                    <div>Paper Data: <a href={doi_pdf}>PDF</a> </div>
                    <div>Paper doi: <a href={doi_url}>{doiValue}</a> </div>
                </div>
            );
        }
    };

    /** Component Rendering Function **/
    render() {
        return (
            <div>
                <div className={'headerStyle'}>
                    Example B: Paper{' '}
                    <a style={{ color: '#e86161' }} href="https://www.orkg.org/orkg/paper/R8186">
                        Open Research Knowledge Graph: Next Generation Infrastructure for Semantic Scholarly Knowledge
                    </a>
                </div>
                <div className={'bodyStyle'}>
                    {this.state.loading && (
                        <h2 className="h5">
                            <span>
                                <Icon icon={faSpinner} spin />
                            </span>{' '}
                            Loading ...
                        </h2>
                    )}
                    {!this.state.loading && this.renderData()}
                </div>
    </div>
        );
    }
}
export default ExampleB;
