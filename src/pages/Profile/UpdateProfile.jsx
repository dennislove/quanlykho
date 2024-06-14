import React, { useEffect, useState } from 'react';
import { auth , storage} from '../../App';
import { onAuthStateChanged } from 'firebase/auth';
import {
  getDatabase,
  ref,
  child,
  get,
  onValue,
  update
} from 'firebase/database';

function UpdateProfile() {
  const [users, setUsers] = useState([]);
  const [userRole, setUserRole] = useState(null);
  const [toggle, setToggle] = useState(false);
  const [formInput, setFormInput] = useState({});
  //   const [showPasswordForm, setShowPasswordForm] = useState(false);
  //   const [password, setPassword] = useState('');

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(getDatabase(), `Users/${user.uid}`);
        onValue(
          userRef,
          (snapshot) => {
            const userData = snapshot.val();
            if (userData?.auth) {
              setUserRole(userData.auth);
              fetchUsers(userData.auth);
            }
          },
          { onlyOnce: true }
        );
      } else {
        setUserRole(null);
        setUsers([]);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const fetchUsers = (role) => {
    const dbRef = ref(getDatabase(), `Users`);
    get(dbRef)
      .then((snapshot) => {
        if (snapshot.exists()) {
          const fetchedUsers = Object.values(snapshot.val())
            .filter((user) => user.auth === role)
            .map((user) => ({
              ...user,
              createdAt: new Date(user.createdAt).toLocaleString()
            }));
          setUsers(fetchedUsers);
        } else {
          console.log('No data available in Users');
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e, user) => {
    e.preventDefault();
    const userRef = ref(getDatabase(), `Users/${user.uid}`);
    update(userRef, formInput)
      .then(() => {
        alert('Cập nhật profile thành công!');
        setToggle(false); // Optionally close the form on success
      })
      .catch((error) => {
        console.error('Lỗi cập nhật profile: ', error);
        alert('Cập nhật profile thất bại.');
      });
  };
 

  return (
    <>
      <div className="max-w-sm mx-auto mt-10 bg-white p-6 rounded-lg shadow">
        {users.map((user, index) => (
          <div key={index}>
            <div className="flex flex-col items-center">
              <div className=" relative">
                <img
                  className="w-24 h-24 rounded-full border"
                  src={user.avatar}
                  alt="Avatar"
                />
                <button
                  className=" absolute top-[71%] left-1/3  rounded-full bg-gray-100 p-1"
                
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="size-6"
                  >
                    <path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9Z" />
                    <path
                      fillRule="evenodd"
                      d="M9.344 3.071a49.52 49.52 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71.386.054.77.113 1.152.177 1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909.382-.064.766-.123 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.942 2.942 0 0 1 2.332-1.39ZM6.75 12.75a5.25 5.25 0 1 1 10.5 0 5.25 5.25 0 0 1-10.5 0Zm12-1.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
                
              </div>
              <h1 className=" mt-2 text-xl font-semibold">
                {user.fullName ? user.fullName : 'Người dùng'}
              </h1>
            </div>
            <div className="mt-6">
              <button
                onClick={() => setToggle(!toggle)}
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Cập nhật thông tin
              </button>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Quyền hạn: {user.auth}</p>
            </div>
          </div>
        ))}
      </div>

      {/* form update */}
      {toggle && (
        <div className="max-w-xl mx-auto p-4">
          {users.map((user) => (
            <form className="space-y-4" onSubmit={(e) => handleSubmit(e, user)}>
              <div>
                <label
                  htmlFor="fullName"
                  className="block text-sm font-medium text-gray-700"
                >
                  Họ và tên
                </label>
                <input
                  type="text"
                  name="fullName"
                  id="fullName"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formInput.fullName || user.fullName}
                  onChange={handleInputChange}
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email
                </label>
                <input
                  type="text"
                  name="email"
                  readOnly
                  id="email"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-200 rounded-md shadow-sm focus:outline-none "
                  value={formInput.email || user.email}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  SĐT
                </label>
                <input
                  type="text"
                  name="phone"
                  id="phone"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formInput.phone || user.phone}
                  onChange={handleInputChange}
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Địa chỉ
                </label>
                <input
                  type="text"
                  name="address"
                  id="address"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  value={formInput.address || user.address}
                  onChange={handleInputChange}
                  placeholder="Nhập địa chỉ"
                />
              </div>
              {/* Repeat for other fields */}
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 hover:bg-indigo-700 text-white font-bold rounded-md"
              >
                Cập Nhật
              </button>
            </form>
          ))}
        </div>
      )}
    </>
  );
}

export default UpdateProfile;
