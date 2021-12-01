import * as mobilenet from "@tensorflow-models/mobilenet";
// import { div } from "@tensorflow/tfjs-core";
import { useEffect, useRef, useState } from "react";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [identifyResults, setIdentifyResults] =  useState([]);

  const imageRef= useRef();

  const uploadImage = (e) =>{
    console.log(e);
    const {files}=e.target;
    if(files.length>0){
      const url = URL.createObjectURL(files[0]);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  }
  const loadModel = async() =>{
    setIsModelLoading(true);
    try{
      const model = await mobilenet.load();
      setModel(model);
      setIsModelLoading(false);
    } catch(error){
      console.log(error);
      setIsModelLoading(false);
    }
  }
  const identifyImage= async()=>{
    const results = await model.classify(imageRef.current);
    // console.log(results);
    setIdentifyResults(results);
  }

  useEffect(()=>{
    loadModel();
  },[]);

  if(isModelLoading){
    return <h2>Model Loading....</h2>
  }
  return (
    <div className="App">
      <h1 className="header">Image Identification</h1>
      <div className="inputHolder">
        <input type="file" accept="image/*" capture='camera' className="uploadInput" onChange={uploadImage}/>
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
             {imageUrl && <img src={imageUrl} alt="Upload Preview" crossOrigin="anonymous" ref={imageRef}/> }
          </div>
          {identifyResults?.length>0 && (
            <div className="resultsHolder">
              {identifyResults.map((result,index)=>(
                <div className="result" key={result.className}>
                  <span className="name">{result.className}</span>
                  <span className="confidence">Confidence level: {(result.probability*100).toFixed(2)}%</span>
                  {index===0 && <span className="bestGuess">Best Guess</span>}
                </div>
              ))}
            </div>
          )}
        </div>
        {imageUrl && <button className="button" onClick={identifyImage}>Identify Image</button>}
      </div>
    </div>
  );
}

export default App;
