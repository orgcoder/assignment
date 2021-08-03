import React, { Component } from 'react';
import './visWidgetConfig.css';
import { FontAwesomeIcon as Icon } from '@fortawesome/react-fontawesome';
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { getComparisonById } from "network/networkRequests";
import { Table } from 'reactstrap';
import { isUri } from 'valid-url';
import ReactReadMoreReadLess from "react-read-more-read-less";

const paperLink = "https://www.orkg.org/orkg/paper/";

class ExampleA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      requestedData: null
        };
    }

    componentDidMount() {
        // fetch data
        this.getData();
    }

    getData = () => {
        getComparisonById('R44930').then(dataFrame => {
            this.setState({ requestedData: dataFrame, loading: false });
        });
    };

    renderData = () => {
        // create an authors array;
        const authorStatements = this.state.requestedData.statementsData.content.filter(item => item.predicate.id === 'P27');

        if (!this.state.requestedData) {
            return <div>Some error</div>;
        } else {
            return (
                <div>
                    <div>
                        Title: <b>{this.state.requestedData.resourceMetaData.label}</b>; Number of contributions:{' '}
                        <b>{this.state.requestedData.comparisonData.contributions.length}</b>
                    </div>
                    <div>
                        Authors:{' '}
                        {authorStatements.map(item => {
                            return item.object.label + '; ';
                        })}
                </div>
                    <div>Comparison Data:</div>
                    {this.renderComparisonTable()}
                </div>
            );
        }
    };

    renderComparisonTable = () => {
        const dataFrame = this.state.requestedData.comparisonData;
        return (
            <Table striped bordered hover responsive>
                {/*  define headers*/}
                <thead>
                    <tr>
                        <th>
                            Contribution
                        </th>
                        {dataFrame.properties
                            .filter(property => property.active === true)
                            .map(property => {
                                return (
                                    <th>
                                        {property.label}
                                    </th>
                                );
                            })}
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(dataFrame.data).map((data, id) => {
                        return (
                            <tr key={'tr_id' + id} style={{ border: '1px solid black', borderTop: 'none' }}>
                                <td
                                    key={'td_id_' + id}>
                                    {dataFrame.contributions[id].contributionLabel}
                                    <><br /></>(<a href={paperLink +
                                dataFrame.contributions[id].paperId +
                                    '/' +
                                dataFrame.contributions[id].id} target={"_blank"}>{
                                    dataFrame.contributions[id].paperId +
                                    '/' +
                                    dataFrame.contributions[id].id
                                }</a>)
                                </td>
                                {this.createRows(id)}
                            </tr>
                        );
                    })}
                </tbody>
                </Table>
        );
    };

    createRows = rowId => {
        // property filtering
        const dataFrame = this.state.requestedData.comparisonData;
        const activeProperties = dataFrame.properties.filter(property => property.active === true);
        return activeProperties.map(property => {
            const dataValues = dataFrame.data[property.id][rowId];
            return (
                <td
                    key={'td_id' + rowId + '_' + property.id} >
                    {dataValues.map(val => {
                        if (val.label)
                        {
                            if (isUri(val.label))
                            {
                                var sub = onlyDomain(val.label);
                                return <><a href={val.label} target={"_blank"}>►{sub} </a><br /></>;
                            }
                            else
                            {
                                return <><ReactReadMoreReadLess
                                    charLimit={30}
                                    readMoreText=<a href="#">{"Read more ▼"}</a>
                                    readLessText=<a href="#">{"Read less ▲"}</a>
                                >
                                    {val.label}
                                </ReactReadMoreReadLess></>
                            }
                        }
                        else
                            return val.label + ' ';
                    })}
                </td>
            );
        });
    };

    /** Component Rendering Function **/
    render() {
        return (
            <div>
                <div className={'headerStyle'}>
                    Example A: Comparisons{' '}
                    <a style={{ color: '#e86161' }} href="https://www.orkg.org/orkg/comparison/R44930">
                        COVID-19 Reproductive Number Estimates
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
//-------OnlyDomain function--------
function onlyDomain(url){
    var a = document.createElement('a');
    a.href = url;
    var s = a.hostname.split('.'), d = s.length-2;
    return s[d]+'.'+s[d+1];
}
export default ExampleA;
