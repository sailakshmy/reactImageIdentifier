import * as mobilenet from "@tensorflow-models/mobilenet";
// import { div } from "@tensorflow/tfjs-core";
// import {axiosClient} from 'axios';
import { useEffect, useRef, useState } from "react";

function App() {
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [model, setModel] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [identifyResults, setIdentifyResults] =  useState([]);
  const [history, setHistory] = useState([]);

  const imageRef= useRef();
  // const textInputRef = useRef();
  const fileInputRef = useRef();

  const uploadImage = (e) =>{
    // console.log(e);
    const {files}=e.target;
    if(files.length>0){
      const url = URL.createObjectURL(files[0]);
      // console.log(url);
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
    // textInputRef.current.value='';
    const results = await model.classify(imageRef.current);
    // console.log(results);
    setIdentifyResults(results);
  }
  // const handleOnChange = async (e) =>{
  //   console.log(e.target.value);
  //   console.log(e);
  //   const imgURL = e.target.value;
  //   // //https://blog.logrocket.com/programmatic-file-downloads-in-the-browser-9a5186298d5c/ - Data from here
  //   // fetch(e.target.value)
  //   //   .then(res=>res.json())
  //   //   .then(resp=>resp.blob())
  //   //   .then((blob)=>{
  //   //     const url = URL.createObjectURL(blob);
  //   //     setImageUrl(url);
  //   //     setIdentifyResults([]);
  //   //     },(error)=>{
  //   //       console.log(error);
  //   //       setIsModelLoading(true);
  //   //     });
  //   // setImageUrl(e.target.value);
  //   //     setIdentifyResults([]);
  //   let imageBlob;
  //   try{
  //     imageBlob = (await axiosClient.get(imgURL),{
  //       responseType:'blob'
  //     }).data;
  //     console.log(imageBlob)
  //   }catch(err){
  //     console.log(err);
  //     setIsModelLoading(true);
  //   }
  //   setImageUrl(URL.createObjectURL(imageBlob));
  //   setIdentifyResults([]);
  // }

  // const handleOnChange = (e) => {
  //   setImageUrl(e.target.value);
  //   setIdentifyResults([]);
  // }
  const triggerUpload = () =>{
    fileInputRef.current.click();
    setIdentifyResults([]);
  }

  const handleRecentImageClick = (e) =>{
    console.log(e.target.src);
    setImageUrl(e.target.src);
    setIdentifyResults([]);
  }

  useEffect(()=>{
    loadModel();
  },[]);

  useEffect(()=>{
    if(imageUrl){
      setHistory([imageUrl,...history])
    }
  }, [imageUrl]);
  if(isModelLoading){
    return <h2>Model Loading....</h2>
  }
  return (
    <div className="App">
      <h1 className="header">Image Identification</h1>
      <div className="inputHolder">
        <input type="file" accept="image/*" capture='camera' className="uploadInput" onChange={uploadImage} ref={fileInputRef}/>
        <button className="uploadImage" onClick={triggerUpload}>Upload Image</button>
        {/* <span className="or">OR</span>
        <input type="text" placeholder="Paste image URL here" onChange={handleOnChange} ref={textInputRef}/> */}
      </div>
      <div className="mainWrapper">
        <div className="mainContent">
          <div className="imageHolder">
             {imageUrl && <img src={imageUrl} alt="Upload Preview" ref={imageRef}/> }
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
      {history.length > 0 && (
              <div className="recentPredictions">
              <h2>Recent Images</h2>
              <div className="recentImages">
                      {history.map((image,index)=>(
                        <div className="recentPrediction" key={`${image}${index}`}>
                          <img src={image} alt="Recent prediction" onClick={handleRecentImageClick}/>
                        </div>
                      ))}
              </div>
            </div>
      )}
    </div>
  );
}

export default App;
