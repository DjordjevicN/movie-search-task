import React, { useState } from "react";
import TextInput from "../../atoms/TextInput/TextInput";
import "./LoginPage.scss";

const LoginPage = () => {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");

  const handleUserLogin = (event) => {
    event.preventDefault();
    const userCredentials = { userName, password };
    console.log(userCredentials);
    setUserName("");
    setPassword("");
  };
  return (
    <div className="loginPage">
      <div className="loginPage__content">
        <div className="loginBgImage" />

        <div className="formWrapper">
          <div className="formWrapper__content">
            <div className="form-title">
              <h1>Login</h1>
              <p>Login to gain access our movie search</p>
            </div>

            <form onSubmit={handleUserLogin}>
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

              <input type="submit" value="Login" />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
