import { useNavigate} from "react-router-dom";
import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../../App.js';
import { getDatabase, ref, get } from "firebase/database";

import image from '../../images/pattern.png';

import PasswordInput from '../../auth/PasswordInput';

export function SignIn() {
    const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const auth = getAuth();

  const handleSignIn = (event) => {
     event.preventDefault(); 
    // console.log("Form Submitted");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("User logged in:", userCredential.user);
        fetchUserInfo(userCredential.user.uid);
        setError("")
      })
      .catch((error) => {
        // alert('Login failed: ' + error.message);
        setError("Tên đăng nhập hoặc mật khẩu không đúng")
      });
  };
  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };


  function fetchUserInfo(uid) {
    const db = getDatabase();
    const userRef = ref(db, 'Users/' + uid);

    get(userRef).then((snapshot) => {
      if (snapshot.exists()) {
        const userInfo = snapshot.val();
        navigate(userInfo.auth === "Admin" ? '/product' : '/product', { replace: true });
      } else {
        navigate('/', { replace: true }); // Default redirect if no specific role is found
      }
    }).catch((error) => {
      console.error("Error fetching user data:", error);
    });
  }
  return (
    <div>
      <section className="m-8 flex">
        <div className="w-2/5 h-full hidden lg:block">
          <img src={image} className="h-full w-full object-cover rounded-3xl" />
        </div>
        <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
          <div className="text-center">
            <h2 className="font-bold mb-4 text-4xl">Đăng Nhập</h2>
            <h3 color="blue-gray" className="text-lg font-normal">
              Vui lòng điền thông tin.
            </h3>
          </div>

          <form
            className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2"
            onSubmit={handleSignIn}
          >
            <div className="mb-1 flex flex-col gap-6">
              <label
                htmlFor="email"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                placeholder="name@mail.com"
                className=" border p-3 rounded-lg focus:!border-t-gray-900"
              />
              <label
                htmlFor="password"
                color="blue-gray"
                className="-mb-3 font-medium"
              >
                Mật khẩu
              </label>
              <PasswordInput value={password} onChange={handlePasswordChange} />
            </div>

            <button
              type="submit"
              className="mt-6 bg-black text-white  text-center px-[11rem] py-3 rounded-lg"
            >
              Đăng Nhập
            </button>
            <h2 className=" underline text-center mt-2">Quên mật khẩu?</h2>
            {error && <p className="text-red-500">{error}</p>}
          </form>
        </div>
      </section>
    </div>
  );
}

export default SignIn;
