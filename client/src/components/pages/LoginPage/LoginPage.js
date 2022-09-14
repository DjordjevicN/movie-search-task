import React, { useState, useContext } from "react";
import TextInput from "../../atoms/TextInput/TextInput";
import "./LoginPage.scss";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const LoginPage = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [showError, setShowError] = useState(false);
  const [haveAccount, setHaveAccount] = useState(true);
  const { state, setState } = useContext(UserContext);

  const handleUserLogin = async (event) => {
    event.preventDefault();
    const userCredentials = { userName, password };
    const response = await axios.post(
      "http://localhost:5000/login_user",
      userCredentials
    );
    if (response.data.error) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 2000);
    }
    if (response.status === 200 && !response.data.error) {
      setUserName("");
      setPassword("");
      setState({ ...state, isLoggedIn: true });
      navigate("/");
    }
  };

  const handleCreateUser = async (event) => {
    event.preventDefault();
    const userCredentials = { userName, password };
    const response = await axios.post(
      "http://localhost:5000/create_user",
      userCredentials
    );

    if (response.status === 200 && !response.data.error) {
      setHaveAccount(!haveAccount);
      setUserName("");
      setPassword("");
    }
  };
  return (
    <div className="loginPage">
      <div className="loginPage__content">
        <div className="loginBgImage" />
        <div className="formWrapper">
          <div className="formWrapper__content">
            <div className="form-title">
              <h1>{haveAccount ? "Login" : "Create Account"}</h1>
              <p>
                {haveAccount
                  ? "Login to gain access our movie search"
                  : "Create account to gain access our movie search"}
              </p>
            </div>

            <form onSubmit={haveAccount ? handleUserLogin : handleCreateUser}>
              <TextInput
                placeholder={"User name"}
                onChange={(inputValue) => setUserName(inputValue)}
                value={userName}
                autoFocus
              />
              <TextInput
                placeholder={"Password"}
                onChange={(inputValue) => setPassword(inputValue)}
                value={password}
                type="password"
              />

              <input
                style={{ backgroundColor: showError && "#e92d20" }}
                type="submit"
                value={haveAccount ? "Login" : "Create Account"}
              />
            </form>
            <div className="switchButton">
              <button onClick={() => setHaveAccount(!haveAccount)}>
                {haveAccount ? "Don't have account" : "I have account"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
