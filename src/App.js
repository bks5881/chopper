import React, { useState, useEffect } from "react";

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
import { get } from 'aws-amplify/api';

function App({ signOut }) {
  const [selectedHelicopter, setSelectedHelicopter] = useState(null);
  const [selectedHelicopterName, setSelectedHelicopterName] = useState('');
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
      const response =await restOperation.response;
      console.log('GET call succeeded');
      console.log(response);
    } catch (e) {
      console.log('GET call failed: ', e);
    }
  }
  const handleSelectHelicopter = (helicopterId, helicopterName) => {
    setSelectedHelicopter(helicopterId);
    setSelectedHelicopterName(helicopterName);
    setShowConfirmDialog(true);
  };

  const handleBack = () => {
    setShowSelectedHelicopter(false);
  };
  const helicopters = [
    { id: 'helicopter1', name: 'Helicopter 1', src: 'Picture1.png' },
    { id: 'helicopter2', name: 'Helicopter 2', src: 'Picture1.png' }
  ];



  const handleConfirmSelection = () => {
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

      {!showSelectedHelicopter && (
        <div>
          <div className="row justify-content-center">
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
                <Button className="btn btn-primary" onClick={handleConfirmSelection}>Confirm</Button>
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
            <Button className="btn btn-primary">Forward</Button>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default withAuthenticator(App);


