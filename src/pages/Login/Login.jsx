import React, { useContext, useState } from "react";
import "./login.scss";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../App";
import { AuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";

const Login = () => {
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const { dispatch } = useContext(AuthContext);

  const handleLogin = (e) => {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        fetchUserInfo(user.uid, user);
      })
      .catch((error) => {
        setError(true);
      });
  };

  const fetchUserInfo = (uid, user) => {
    const db = getDatabase();
    const userRef = ref(db, `Users/${uid}`);

    get(userRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const userInfo = snapshot.val();

          dispatch({
            type: "LOGIN",
            payload: { user, role: userInfo.auth },
          });
          navigate("/dashboard");
        } else {
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        navigate("/");
      });
  };

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
        {error && <span>Wrong email or password</span>}
      </form>
    </div>
  );
};

export default Login;
