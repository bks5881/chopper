import React, { useState, useEffect } from 'react';
import { get } from 'aws-amplify/api';
import {   Button } from 'react-bootstrap';
const MySummary = ({ userid, sessionId, handleSummaryBack }) => {
    const [data, setData] = useState(null);
    useEffect(() => {
        const fetchData = async () => {
            try {
                //const response = await API.get('meggit3', `/lead/${userid}/${interestid}`);
                const restOperation = get({
                    apiName: 'meggit3',
                    path: `/getlead/${userid}/${sessionId}`,
                });
                const response = await restOperation.response;
                console.log('GET call succeeded');
                console.log(response);
                response.body.json().then((allData) => {
                    // Now 'data' contains the parsed JSON object
                    const parsedData = allData;
                    setData(parsedData);
                })
                    .catch((error) => {
                        console.error('Error parsing JSON:', error);
                    })
                // Parse the response body

            } catch (e) {
                console.log('GET call failed: ', e);
            }
        };

        fetchData();
    }, [userid, sessionId]);

    return (
        <div>
            <h5>Complete features and additional details</h5>
            {data && (
                <table className="table table-bordered table-hover table-striped">
                    <thead className="thead-dark">
                        <tr>
                            <th>Scenario Steps</th>
                            <th>Selected Options</th>
                            <th>Additional Comment</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* Example: displaying data for 'configure' step */}
                        {data.selectedItem && (
                            <tr>
                                <td>Environment</td>
                                <td>{data.selectedItem}</td>
                                <td>{data.page1_text}</td>
                            </tr>
                        )}
                        {data.configure && (
                            <tr>
                                <td>DATU amount</td>
                                <td>1</td>
                                <td>{JSON.parse(data.configure).info}</td>
                            </tr>
                        )}
                        {data.configure && (
                            <tr>
                                <td>Sensor assigned to DATU 1</td>

                                <td>{JSON.parse(data.configure).attachedSensors}</td>
                                <td>{JSON.parse(data.configure).info}</td>
                            </tr>
                        )}
                        {/* Add other rows for different steps */}
                        {
                            data.dataFeatures && (
                                <tr>
                                    <td>Output type</td>

                                    <td>{JSON.parse(data.dataFeatures).dataFeatures.outputLocation}</td>
                                    <td>{JSON.parse(data.dataFeatures).dataFeatures.additionalInfo}</td>
                                </tr>
                            )
                        }
                        {
                            data.network && (
                                <tr>
                                    <td>Communication link</td>

                                    <td>{JSON.parse(data.network).additionalInfo}</td>
                                    {JSON.parse(data.network)?.lines?.length > 0 && JSON.parse(data.network).lines[0].comment ? (
    <td>{JSON.parse(data.network).lines[0].comment}</td>
) : null}

                                </tr>
                            )
                        }
                    </tbody>
                </table>
            )}
            <Button 
                variant="secondary" 
                type="button" 
                onClick={handleSummaryBack}
                className="mt-3 mr-2"
            >
                Back
            </Button>
        </div>
    );
};

export default MySummary;