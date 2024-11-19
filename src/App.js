import google from "./Images/google.png";
import seoLogo from "./Images/seo.png";
import './App.css';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

function App() {
  // Declaring states:
  const [platform, setPlatform] = useState('desktop');
  const [website, setWebsite] = useState("");
  const [progress, setProgress] = useState(false);
  const [result, setResult] = useState(false);
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [state, setState] = useState({
    user:null,
    isLoggedIn: false,
    token: null,
    score: null
  });
  const apiUrl = "http://localhost:8000";

  // Declaring Functions:
  const updateTheUserAuth = async () => {
    const tokenOne = await getToken();
    if(tokenOne != null){
      await fetch(apiUrl,{
        method: "GET",
        headers:{
          "Authorization":"Bearer "+tokenOne, //7|PcbHyuYFiSHTDdBck8SONPur9SzlUHLZ7jilnIINe8f78a02
          "Content-Type":"application/json",
          "Accept":"application/json"
        }
      }).then((response) => response.json())
      .then((data) => {
        if(data != null && data["data"] != null){
          setState({
            ...state,
            user: data["data"],
            isLoggedIn: true,
            token: tokenOne
          });
        }
      });
    }
  }
  const getToken = async() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get('token');
    const tokenData = await AsyncStorage.getItem('token');
    if(token != null && token != undefined){
      await AsyncStorage.setItem("token", token);
      return token;
    }
    else if(tokenData != null){
      return tokenData;
    }
    else{
      return null;
    }
  }
  const googleAuth = () => {
    window.location.href="http://localhost:8000/google/redirect";
  }
  const handlePlatform = (event) => {
    setPlatform(event.target.value);
  };
  const handleWebsite = (event) => {
    setWebsite(event.target.value);
  }
  const showReport = async () => {
    let token = state["token"];
    if(token == null){
      alert("You are not authenticated");
    }
    else if(website == ""){
      alert("Website field is empty. Please, fix this.");
    }
    else{
      setProgress(true);
      setResult(false);
      setIsButtonDisabled(true);
      await fetch(apiUrl+"/seo/performance-score?website="+website+"&platform="+platform, {
        method: "GET",
        headers:{
          "Authorization":"Bearer "+token,
          "Content-Type":"application/json",
          "Accept":"application/json"
        }
      }).then((response) => response.json())
      .then((data) => {
        if(data["status"] == 200){
          setState({
            ...state,
            score:data["data"]
          });
          console.log(data);
          setResult(true);
          setProgress(false);
          setIsButtonDisabled(false);
        }
        else{
          alert("You website is inactive or there is problem like these. Please, try again later.");
        }
      });
    }
  }

  // When page load:
  useEffect(() => {
    updateTheUserAuth();
  }, [0]);

  return (
    <div className="Container">
      <div className="MiniContainer">
        <div className="Header">
          <img className="SeoLogo" src={seoLogo} alt="SEO Logo" />
          <div className="SeoHeaderDiv1">
            <div className="googleButton">
              {!state["isLoggedIn"] ? (
                <div onClick={googleAuth} className="googleButton">
                    <img className="googleIcon" src={google} alt="Google Icon" />
                    <p className="googleText">Sign in with Google</p>
                </div>
              ) : (
                <p className="googleText">
                  {state["user"]["name"]}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="Banner">
        <p className="BannerTitle">
          Give You Website and Get Your Report Instantly
        </p>
        <div className="FullWidth">
          <div className="secondContianer">
            <input style={{
              width: "61%",
              marginRight: 0
            }} className="BannerInput" placeholder="Website Url.."
            value={website}
            onChange={handleWebsite}/>
            <select style={{
              width: "30%",
              marginLeft: "1%"
            }} className="BannerInput"
            value={platform}
            onChange={handlePlatform}>
              <option value="desktop">Desktop</option>
              <option value="mobile">Mobile</option>
            </select>
          </div>
        </div>
        <div style={{
          marginTop: 10
        }} className="FullWidth">
          <div className="secondContainer">
            <button 
            onClick={showReport} 
            className="bannerButton"
            disabled={isButtonDisabled}>
              Show Report Now
            </button>
          </div>
        </div>
        {/* Progress bar: */}
        {progress ? (
          <div style={{
            width: "100%",
            marginTop: 20,
            display:"flex",
            justifyContent:"center",
            alignItems:"center"
          }}> 
            <div className="loader"></div>
          </div>
        ) : null}
        {/* Score Performance: */}
        {result ? (
          <div>
            <div style={{
              width: "100%", 
              display:"flex",
              justifyContent:"center",
              alignItems:"center"
            }}>
              <div style={{
                marginTop: 20,
                width:120,
                height: 120,
                border: "5px solid white",
                borderRadius: 100,
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
              }}>
                <p style={{
                  margin:0,
                  color: "white",
                  fontSize: 32,
                  fontWeight:"bold",
                  fontFamily: "'Poppins', sans-serif"
                }}>
                  {parseFloat(state["score"]).toFixed(2)}
                </p>
              </div>
            </div>
            <p style={{
              marginTop:10,
              color: "white",
              fontSize: 15,
              fontWeight:600,
              fontFamily: "'Poppins', sans-serif"
            }}>
              Your website performance score is: {parseFloat(state["score"]).toFixed(2)}
            </p>
          </div>
        ) : null}
      </div>
      <div className="MiniContainer">
        <div className="Header">
          <div>
            <p className="TextContainerText">
              Boost your website's performance with our comprehensive SEO checker! Get an in-depth analysis of your site's strengths and areas for improvement. Our SEO tool evaluates critical factors like keyword usage, mobile responsiveness, page speed, and meta tags to help you rank higher in search engines and attract more traffic. Whether you're a beginner or a seasoned marketer, our easy-to-use SEO checker gives you actionable insights to enhance your site's visibility and reach your audience effectively. Start optimizing today for a stronger online presence!
            </p>
            <p className="TextContainerText">
              Take control of your site's SEO with actionable suggestions and a clear overview of your site's metrics. Whether you're optimizing for the first time or fine-tuning an established site, our SEO checker is built to guide you every step of the way. Start enhancing your online presence today—see how your site measures up, gain a competitive edge, and turn more visitors into loyal customers!
            </p>
            <p className="TextContainerText">
              With our SEO checker, you don’t need to be an expert to optimize your site effectively. Our tool breaks down complex SEO elements into easy-to-understand insights, from backlinks and site structure to mobile compatibility and content quality. By regularly using our checker, you can track improvements over time, stay up-to-date with SEO best practices, and ensure your website is always performing at its best.
            </p>
          </div>
        </div>
      </div>
      <div className="footerDiv">
        <p className="footerText">
          &copy; 2024 Programming. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default App;
