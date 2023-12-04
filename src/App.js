import React, { useState, useEffect } from "react";
import CarCustomizationPage from './DatuPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from "./logo.svg";
import "@aws-amplify/ui-react/styles.css";
import { getCurrentUser } from 'aws-amplify/auth';
import {
  withAuthenticator,
  Button,
  Heading,
  Image,
  View,
  Card,
} from "@aws-amplify/ui-react";
import { generateClient } from 'aws-amplify/api';
import { get, post } from 'aws-amplify/api';

function App({ signOut }) {
  const [selectedHelicopter, setSelectedHelicopter] = useState(null);
  const [selectedHelicopterName, setSelectedHelicopterName] = useState('');
  const [currentSessionId, setCurrentSessionId] = useState('');
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showSelectedHelicopter, setShowSelectedHelicopter] = useState(false);
  const [inputText, setInputText] = useState("");

  async function getTodo() {
    try {
      const restOperation = get({
        apiName: 'meggit3',
        path: '/lead',
        // options: {
        //   body: {
        //     message: 'Mow the lawn'
        //   }
        // }
      });
      const response = await restOperation.response;
      console.log('GET call succeeded');
      console.log(response);
    } catch (e) {
      console.log('GET call failed: ', e);
    }
  }
  const [showDATUPage, setShowDATUPage] = useState(false);
  const handleSelectHelicopter = (helicopterId, helicopterName) => {
    setSelectedHelicopter(helicopterId);
    setSelectedHelicopterName(helicopterName);
    setShowConfirmDialog(true);
  };
  function handleFirstForward() {
    // Your function logic here
    console.log(inputText);
    //setShowSelectedHelicopter(false);
    // You can perform any action you need when the button is clicked.
    startSession(selectedHelicopter, username);
    setShowSelectedHelicopter(false);
    setShowDATUPage(true);

  }
  const handleBack = () => {
    setShowSelectedHelicopter(false);
  };
  const helicopters = [
    { id: 'helicopter1', name: 'Helicopter 1', src: 'Picture1.png' },
    { id: 'helicopter2', name: 'Helicopter 2', src: 'Picture1.png' }
  ];


  const startSession = async (selectedHelicopterId, userId) => {

    try {
      const restOperation = post({
        apiName: 'meggit3',
        path: '/updatesession',
        options: {
          body: {
            userid: username,
            selectedItem: selectedHelicopter,
            page1_text: inputText
          }
        }
      });
      const response = await restOperation.response;
      response.body.json().then((data) => {
        // Now 'data' contains the parsed JSON object
        const interestIdValue = data.interestId;
        console.log("The session id is" + interestIdValue); // This will print the 'interestId' value
        setCurrentSessionId(interestIdValue)
      })
        .catch((error) => {
          console.error('Error parsing JSON:', error);
        });
      console.log('Post call succeeded');
      //const responseBody = JSON.parse(response);
    } catch (e) {
      console.log('POSt call failed: ', e);
    }
  };
  const handleConfirmSelection = async (selectedHelicopterId, userId) => {
    setShowConfirmDialog(false);
    setShowSelectedHelicopter(true);
    getTodo();

  };

  const handleCloseDialog = () => {
    setShowConfirmDialog(false);
  };
  useEffect(() => {
    async function currentAuthenticatedUser() {
      try {
        const { username, userId, signInDetails } = await getCurrentUser();
        console.log(`The username: ${username}`);
        setUsername(username);
        console.log(`The userId: ${userId}`);
        console.log(`The signInDetails: ${signInDetails}`);
      } catch (err) {
        console.log(err);
      }
    }
    currentAuthenticatedUser();
  }, []);
  const [username, setUsername] = useState('');
  return (
    <div className="container mt-5">
      <Button onClick={signOut} className="sign-out-btn">Sign Out</Button>
      <div className="row justify-content-between">
        <div className="col-auto">
          <img src="meggit.jpg" alt="Meggitt Logo" />
        </div>
        <div className="col-auto">
          <span>Logged in as {username}</span>
        </div>
      </div>

      {!showSelectedHelicopter && !showDATUPage && (
        <div>
          <div className="row justify-content-center">
            <h5>Choose environment</h5>
            {helicopters.map((helicopter) => (
              <div className="col-md-4 mb-3 text-center" key={helicopter.id}>
                <Image
                  src={helicopter.src}
                  alt={helicopter.name}
                  className="img-thumbnail img-hover-effect"
                  onClick={() => handleSelectHelicopter(helicopter.id)}
                  style={{ cursor: 'pointer' }}
                />
                <p>{helicopter.name}</p>
              </div>
            ))}
          </div>

          {showConfirmDialog && (
            <div className="modal d-block">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Confirm Selection</h5>
                    <button type="button" className="btn-close" onClick={handleCloseDialog}></button>
                  </div>
                  <div className="modal-body">
                    <p>Are you sure you want to select {selectedHelicopter}?</p>
                  </div>
                  <div className="modal-footer">
                    <Button className="btn btn-primary" onClick={() => handleConfirmSelection(selectedHelicopter)}>Confirm</Button>
                    <Button className="btn btn-secondary" onClick={handleCloseDialog}>Cancel</Button>

                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {showSelectedHelicopter && (
        <div className="text-center selected-helicopter">
          <Image
            src={helicopters.find(h => h.id === selectedHelicopter)?.src}
            alt="Selected Helicopter"
            className="selected-img"
          />
          <div className="input-group my-3">
            <input
              type="text"
              className="form-control"
              placeholder="Add comment"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>
          <div className="btn-group">
            <Button className="btn btn-secondary" onClick={handleBack}>Back</Button>
            <Button className="btn btn-primary" onClick={handleFirstForward}>Forward</Button>

          </div>
        </div>
      )}
      {showDATUPage && <CarCustomizationPage
        username={username}
        sessionId={currentSessionId}
        selectedHelicopter={selectedHelicopter} />}
    </div>
  );
};

export default withAuthenticator(App);


