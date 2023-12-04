import React from 'react';
import { Container, Row, Col, Image, Button, Form } from 'react-bootstrap';

const DataFeatures = ({ selectedDatu, selectedSensors, selectedHelicopter, handleNext }) => {
  const [outputLocation, setOutputLocation] = React.useState('BB');
  const [additionalInfo, setAdditionalInfo] = React.useState('');
  const [showConfirmDataFeatures, setShowConfirmDataFeatures] = React.useState(false);
  return (
    <>
      <Container>
        <Row>
          <Col md={8}>
            <h5>Selected Helicopter: {selectedHelicopter}</h5>
            <Image src={`Picture1.png`} fluid />
          </Col>
          <Col md={4}>
            <h3>Choose data features and functional safety level</h3>
            <Form>
              <Form.Group>
                <Form.Label>Selected Datu Item: {selectedDatu}</Form.Label>
              </Form.Group>
              <Form.Group>
                <h5>Selected Sensors:</h5>
                <ul>
                  {selectedSensors.map((sensor, index) => (
                    <li key={index}>{sensor}</li>
                  ))}
                </ul>
              </Form.Group>
              <Form.Group>
                <Form.Label>Output Location:</Form.Label>
                <Form.Control as="select" value={outputLocation} onChange={(e) => setOutputLocation(e.target.value)}>
                  <option value="BB">BB</option>
                  {/* Additional options can be added here */}
                </Form.Control>
              </Form.Group>
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
                onClick={() => handleNext(outputLocation, additionalInfo)}
                className="mt-3"
              >
                Next
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default DataFeatures;
