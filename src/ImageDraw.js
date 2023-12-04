import React, { useState, useRef, useEffect } from 'react';
import {   Button } from 'react-bootstrap';
import { post } from 'aws-amplify/api';
const ImageAnnotation = ({ selectedHelicopter, show, setImageDraw, userid, interestId }) => {
    const [startPoint, setStartPoint] = useState(null);
    const [lines, setLines] = useState([]);
    const [currentLine, setCurrentLine] = useState(null);
    const [endPoint, setEndPoint] = useState(null);
    const [showTextbox, setShowTextbox] = useState(false);
    const [lineComment, setLineComment] = useState('');
    const canvasRef = useRef(null);
    const [additionalInfo, setAdditionalInfo] = useState('');
    //const [isLoading, setIsLoading] = useState(true);
    const [selectedLineIndex, setSelectedLineIndex] = useState(null); // 
    const handleCanvasClick = (event) => {
        //setImageLoaded(false);
        const rect = canvasRef.current.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const clickedLineIndex = lines.findIndex(line => isClickOnLine(event, line));
        let lineClicked = false;

        for (let i = 0; i < lines.length; i++) {
            if (isClickOnLine(x, y, lines[i].startPoint, lines[i].endPoint)) {
                setSelectedLineIndex(i);
                setShowTextbox(true);
                lineClicked = true;
                break; // Break the loop if a line is clicked
            }
        }
    
        if (!lineClicked) {
            // If no line was clicked, reset the selected line and hide the textbox
            setSelectedLineIndex(null);
            setShowTextbox(false);
        };
        if (!currentLine) {
          setCurrentLine({ startPoint: { x, y }, endPoint: null });
        } else if (!currentLine.endPoint) {
          const newLine = { ...currentLine, endPoint: { x, y } };
          setLines([...lines, newLine]);
          setCurrentLine(null);
          if(lines && lines.length <=1)
          {drawLine(newLine.startPoint, { x, y });}
        }
      };
      const handleSubmit = async () => {
        const lineData = lines.map((line, index) => {
            return {
                startPoint: line.startPoint,
                endPoint: line.endPoint,
                comment: line.comment || '' // Assuming you store comments in the line object
            };
        });
    
        const data = {
            action:"network",
            numberOfLines: lines.length,
            lines: lineData,
            userid: userid,
            interestId: interestId,
            additionalInfo: additionalInfo
        };
        
    
        console.log(JSON.stringify(data)); // Here you can also call an API or handle the data as needed
        try {
            const restOperation = post({
              apiName: 'meggit3',
              path: '/updatesession',
              options: {
                body: data
              }
            });
            const response = await restOperation.response;
    
            console.log('Post call succeeded');
            //const responseBody = JSON.parse(response);
          } catch (e) {
            console.log('POSt call failed: ', e);
          }
    };
    const drawLine = (start, end) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.strokeStyle = 'yellow';
        ctx.lineWidth = 5;
        ctx.stroke();
    };
    const [imageLoaded, setImageLoaded] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const isClickOnLine = (x, y, startPoint, endPoint) => {
        if(startPoint  && endPoint)
        {const distance = pointToLineDistance(x, y, startPoint, endPoint);
        if (distance <= 20) { console.log("Clicked on line"); }
        return distance <= 20;} // 3 pixels radius
    };
    const imageRef = useRef(null);

    const handleAdditionalInfoChange = (event) => {
        setAdditionalInfo(event.target.value);
    };

    useEffect(() => {
        setImageLoaded(false);
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        const image = new Image();
        //context.clearRect(0, 0, canvas.width, canvas.height);
        //context.fillText('Loading...', canvas.width / 2, canvas.height / 2); // Simple text loading indicator
        image.onload = () => {
          canvas.width = image.width;
          canvas.height = image.height;
          context.drawImage(image, 0, 0);
          setImageLoaded(true);
          //setIsLoading(false);
        };
    
        image.src = selectedHelicopter;
      }, [selectedHelicopter]);
    const pointToLineDistance = (x, y, start, end) => {
        const A = x - start.x;
        const B = y - start.y;
        const C = end.x - start.x;
        const D = end.y - start.y;

        const dot = A * C + B * D;
        const lenSq = C * C + D * D;
        let param = -1;
        if (lenSq !== 0) { // avoid division by zero
            param = dot / lenSq;
        }

        let xx, yy;

        if (param < 0) {
            xx = start.x;
            yy = start.y;
        } else if (param > 1) {
            xx = end.x;
            yy = end.y;
        } else {
            xx = start.x + param * C;
            yy = start.y + param * D;
        }

        const dx = x - xx;
        const dy = y - yy;
        return Math.sqrt(dx * dx + dy * dy);
    };

    const handleCommentChange = (event) => {
        const updatedComment = event.target.value;
        setLines(lines.map((line, index) => 
            index === selectedLineIndex ? { ...line, comment: updatedComment } : line
        ));
    };

    const handleOutsideClick = () => {
        console.log("this is happening");
        //setShowTextbox(false);
    };

    return (
        <div style={{ position: 'relative' }} onClick={handleOutsideClick}>
            <h5>Build the network and its features</h5>
            {!imageLoaded && (
                <div className="spinner" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
            )}
            <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                onClick={imageLoaded ? handleCanvasClick : undefined}
                style={{ border: '1px solid black' }}
            />
            {showTextbox && selectedLineIndex !== null && (
       <textarea
       style={{ 
           position: 'absolute', 
           left: `${lines[selectedLineIndex].endPoint.x}px`, 
           top: `${lines[selectedLineIndex].endPoint.y}px` 
       }}
       value={lines[selectedLineIndex].comment}
       onChange={handleCommentChange}
   />
            )}
            <Button 
                variant="secondary" 
                type="button" 
                onClick={() => setImageDraw(false)}
                className="mt-3"
            >
                Back
            </Button>
            <div>
                <label htmlFor="additionalInfo">Additional Info:</label>
                <textarea
                    id="additionalInfo"
                    value={additionalInfo}
                    onChange={handleAdditionalInfoChange}
                    placeholder="Enter additional information here"
                    style={{ width: '100%', marginTop: '10px' }} // You can adjust the styling as needed
                />
            </div>
            <Button 
            variant="primary" 
            type="button" 
            onClick={handleSubmit}
            className="mt-3"
        >
            Next
        </Button>
        </div>
    );
};

export default ImageAnnotation;