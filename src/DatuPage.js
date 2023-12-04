import React, { useState } from 'react';
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';
import ConfirmationModal from './ConfirmationModal';
import { post } from 'aws-amplify/api';
import DataFeatures from './DataFeatures';
import ConfirmDataFeatures from './ConfirmDataFeatures';
import ImageAnnotation from './ImageDraw';

const CarCustomizationPage = ({ username, sessionId, selectedHelicopter }) =>  {
  const [isReviewPage, setIsReviewPage] = useState(false);
  const [selectedImage, setSelectedImage] = useState('Picture1.png');
  const [selectedDatu, setSelectedDatu] = useState(null);
  const [sensorOptions] = useState(['Vibrator', 'Temperature']);
  const [selectedSensors, setSelectedSensors] = useState([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const handleDatuSelect = (datuImage) => {
    setSelectedDatu(datuImage);
    setSelectedSensors([]);
  };
  const [showModal, setShowModal] = useState(false);


   
  const handleCloseModal = () => {
    setShowModal(false);
    //setShowConfirmDataFeatures(false);
  };
  const handleCloseConfirmData = () =>{
    setShowConfirmDataFeatures(false);
  }

  const handleConfirmModal = () => {
    setShowModal(false);
    gotoPage3();
  };

  const gotoPage3 = async () => {


    try {
        const restOperation = post({
          apiName: 'meggit3',
          path: '/updatesession',
          options: {
            body: {
                action: "configure",
                chosenDatu: selectedDatu,
                attachedSensors: selectedSensors,
                info: additionalInfo,
                interestId: sessionId,
                userid: username,
                selectedItem: selectedHelicopter
            }
          }
        });
        const response = await restOperation.response;

        console.log('Post call succeeded');
        //const responseBody = JSON.parse(response);
      } catch (e) {
        console.log('POSt call failed: ', e);
      }
      setIsReviewPage(true);
  };
  const imageDrawHandler = () =>{
    setImageDraw(false);

  }
  const [showConfirmDataFeatures, setShowConfirmDataFeatures] = useState(false);
  const [showImageDraw, setImageDraw] = useState(false);
  const submitDataFeatures = async () => {
    console.log("Making async request")
    const restOperation = post({
        apiName: 'meggit3',
        path: '/updatesession',
        options: {
          body: {
              action: "dataFeatures",
              chosenDatu: selectedDatu,
              attachedSensors: selectedSensors,
              info: additionalInfo,
              interestId: sessionId,
              userid: username,
              selectedItem: selectedHelicopter,
              dataFeatures: { outputLocation:currentOutputLocation, additionalInfo:currentDataFeaturesAdditionalInfo}
          }
        }
      });
    // Here you can add logic for what happens after the review page
    const response = await restOperation.response;
    setImageDraw(true);
  };
  const [currentOutputLocation, setCurrentOutputLocation] = React.useState('');
  const [currentDataFeaturesAdditionalInfo, setCurrentDataFeaturesAdditionalInfo] = React.useState('');
  const handleNextInReview =  (outputLocation, dataFeaturesAdditionalInfo) => {
    console.log({ outputLocation, dataFeaturesAdditionalInfo });
    setCurrentOutputLocation(outputLocation);
    setCurrentDataFeaturesAdditionalInfo(dataFeaturesAdditionalInfo);
    setShowConfirmDataFeatures(true);
    console.log(showConfirmDataFeatures);

    
  };
  const handleSubmit = () => {
    setShowModal(true);
    // Here, you can handle the submission logic
    console.log({
      selectedDatu,
      selectedSensors,
      additionalInfo,
      sessionId,
      username,
      selectedHelicopter
    });
    // You can replace the console.log with your own logic
  };
  const handleSensorSelect = (sensor) => {
    setSelectedSensors((prevSensors) => {
      if (prevSensors.includes(sensor)) {
        // If sensor is already selected, remove it
        return prevSensors.filter(s => s !== sensor);
      } else {
        // Otherwise, add the sensor to the list
        return [...prevSensors, sensor];
      }
    });
  };
  const datus = [
    { id: 'datu1', name: 'Datu 1', src: 'datu1.png' },
    { id: 'datu2', name: 'Datu 2', src: 'datu2.png' }
  ];
  const hideImageAnnotation = () =>{
    setImageDraw(false);

  }
  if(showImageDraw){
    return <ImageAnnotation 
    selectedHelicopter={'Picture1.png'} 
    show={showImageDraw}
    setImageDraw={imageDrawHandler}
    userid={username}
    interestId={sessionId}
    handleGoingBack={hideImageAnnotation}
     />
  }
  if (isReviewPage) {
    return (
        <>
      <DataFeatures
        selectedDatu={selectedDatu}
        selectedSensors={selectedSensors}
        selectedHelicopter={selectedHelicopter}
        handleNext={handleNextInReview}
      />
                <ConfirmDataFeatures
          show={showConfirmDataFeatures}
          handleClose={handleCloseConfirmData}
          handleConfirm={submitDataFeatures}
          output={currentOutputLocation}
          selectedDatu={selectedDatu}
          additionalInfo={currentDataFeaturesAdditionalInfo}
        />
      </>
    );
  }

  return (
    <>
    
    <Container>
      <Row>
        <Col md={8}>
        <h5>Selected Item: {selectedHelicopter}</h5> 
          <Image src={selectedImage} fluid />
        </Col>
        <Col md={4}>
          <h3>Choose DATU location and IOs</h3>
          <Form>
            <Form.Group>
              <Form.Label>Select Datu Item:</Form.Label>
              {datus.map((datu) => (
              <div className={`col-md-4 mb-3 text-center`} key={datu.id}>
                <Image
                  src={datu.src}
                  alt={datu.name}
                  className={`img-thumbnail img-hover-effect  ${selectedDatu === datu.id ? 'selected-datu' : ''}`}
                  onClick={() => handleDatuSelect(datu.id)}
                  style={{ cursor: 'pointer' }}
                />
                <p>{datu.name}</p>
              </div>
            ))}
            </Form.Group>
            {selectedDatu && (
              <Form.Group>
                <Form.Label>Add Sensors for {selectedDatu}:</Form.Label>
                {sensorOptions.map((sensor, index) => (
                  <Button
                    key={index}
                    variant={selectedSensors.includes(sensor) ? 'success' : 'outline-primary'}
                    className="sensor-button"
                    onClick={() => handleSensorSelect(sensor)}
                  >
                    {sensor}
                  </Button>
                ))}
                {selectedSensors.length > 0 && (
                  <div>
                    <h5>Selected Sensors:</h5>
                    <ul>
                      {selectedSensors.map((sensor, index) => (
                        <li key={index}>{sensor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </Form.Group>
            )}
            <Form.Group>
            <Form.Label>Additional Information:</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={additionalInfo}
                onChange={(e) => setAdditionalInfo(e.target.value)}
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="button" 
              onClick={handleSubmit}
              className="mt-3" // Add more classes for styling
            >
              Next
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
    

          <ConfirmationModal
          show={showModal}
          handleClose={handleCloseModal}
          handleConfirm={handleConfirmModal}
          selectedHelicopter={selectedHelicopter}
          selectedDatu={selectedDatu}
          selectedSensors={selectedSensors}
        />
        
        </>
  );
};

export default CarCustomizationPage;
