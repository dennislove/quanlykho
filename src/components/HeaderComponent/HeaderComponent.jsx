import React, { useEffect, useState } from 'react';
import { auth } from '../../App';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from "firebase/database";
  
function HeaderComponent({name}) {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
      // Monitor auth state and user role
      const unsubscribe = onAuthStateChanged(auth, user => {
          if (user) {
              const userRef = ref(getDatabase(), `Users/${user.uid}`);
              onValue(userRef, snapshot => {
                  const userData = snapshot.val();
                  if (userData && userData.auth) {
                      setUserRole(userData.auth); // Update state with user's role
                  }
              }, { onlyOnce: true }); // Listener executes only once per authentication state change
          } else {
              setUserRole(null); // Reset role if no user
          }
      });

      return () => unsubscribe(); // Clean up the listener
  }, []);
  function renderDashboard() {
      switch (userRole) {
          case 'Admin':
              return "Admin";
          case 'Nhân viên nhập':
              return 'Nhân viên nhập';
          case 'Nhân viên xuất':
              return 'Nhân viên xuất';
          default:
              return null; // or any default view
      }
  }


  return (
    <nav className="block w-full max-w-full bg-transparent text-black shadow-none rounded-xl transition-all px-0 py-1">
    <div className="flex flex-col-reverse justify-between gap-6 md:flex-row md:items-center">
      <div className="capitalize">
        <nav aria-label="breadcrumb" className=" w-max">
          <ol className="flex flex-wrap items-center w-full bg-opacity-60 rounded-md bg-transparent p-0 transition-all">
            <li className="flex items-center text-blue-gray-900 antialiased font-rob text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
              <a href="#" className=''>
                <p className="block antialiased font-rob text-sm leading-normal text-blue-gray-900 font-normal opacity-50 transition-all hover:text-blue-500 hover:opacity-100">
                  {renderDashboard()}
                </p>
              </a>
              <span className="text-[#607D8B] text-sm antialiased font-rob font-normal leading-normal mx-2 pointer-events-none select-none">
                /
              </span>
            </li>
            <li className="flex items-center text-blue-gray-900 antialiased font-rob text-sm font-normal leading-normal cursor-pointer transition-colors duration-300 hover:text-light-blue-500">
              <p className="block antialiased font-rob text-sm leading-normal text-blue-gray-900 font-normal">
                {name}
              </p>
            </li>
          </ol>
        </nav>
        <h6 className="block antialiased tracking-normal font-rob text-base font-semibold leading-relaxed text-blue-gray-900">
          {name}
        </h6>
      </div>
      <div className="flex items-center">
        <div className="mr-auto md:mr-4 md:w-56">
          <div className="relative w-full min-w-[200px] h-10 ">
            <input
              className="peer w-full h-full bg-transparent text-[#607D8B] font-rob font-normal outline outline-0 focus:outline-0 disabled:bg-blue-gray-50 disabled:border-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 border focus:border-2 border-t-transparent focus:border-t-transparent text-sm px-3 py-2.5 rounded-[7px] border-blue-gray-200 focus:border-gray-900"
              placeholder=" "
            />
            <label className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate peer-placeholder-shown:text-[#607D8B] leading-tight peer-focus:leading-tight peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-[#607D8B] transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-transparent before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-transparent after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-transparent after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-transparent peer-placeholder-shown:leading-[3.75] text-gray-500 peer-focus:text-gray-900 before:border-blue-gray-200 peer-focus:before:!border-gray-900 after:border-blue-gray-200 peer-focus:after:!border-gray-900">
              Search{" "}
            </label>
          </div>
        </div>
      
        <button
          className="align-middle select-none font-rob font-bold text-center transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none text-xs py-3 rounded-lg text-[#607D8B] hover:bg-[#607d8B]/10 active:bg-[#607d8B]/30 items-center gap-1 px-4 md:flex normal-case"
          type="button"
          >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-5 w-5 text-[#60&d8B]"
          >
              <path
              fillRule="evenodd"
              d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
              clipRule="evenodd"
              />
          </svg>
          {renderDashboard()}
      </button>
        <button
          aria-expanded="false"
          aria-haspopup="menu"
          id=":r5:"
          className="relative align-middle select-none font-rob font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-[#607D8B] hover:bg-[#607D8B]/10 active:bg-[#607D8B]/30"
          type="button"
        >
          <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-5 w-5 text-[#607D8B]"
            >
              <path
                fillRule="evenodd"
                d="M5.25 9a6.75 6.75 0 0113.5 0v.75c0 2.123.8 4.057 2.118 5.52a.75.75 0 01-.297 1.206c-1.544.57-3.16.99-4.831 1.243a3.75 3.75 0 11-7.48 0 24.585 24.585 0 01-4.831-1.244.75.75 0 01-.298-1.205A8.217 8.217 0 005.25 9.75V9zm4.502 8.9a2.25 2.25 0 104.496 0 25.057 25.057 0 01-4.496 0z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
        <button
          className="relative align-middle select-none font-rob font-medium text-center uppercase transition-all disabled:opacity-50 disabled:shadow-none disabled:pointer-events-none w-10 max-w-[40px] h-10 max-h-[40px] rounded-lg text-xs text-[#607D8B] hover:bg-[#607D8B]/10 active:bg-[#607D8B]/30"
          type="button"
        >
          <span className="absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
              className="h-5 w-5 text-[#607D8B]"
            >
              <path
                fillRule="evenodd"
                d="M11.078 2.25c-.917 0-1.699.663-1.85 1.567L9.05 4.889c-.02.12-.115.26-.297.348a7.493 7.493 0 00-.986.57c-.166.115-.334.126-.45.083L6.3 5.508a1.875 1.875 0 00-2.282.819l-.922 1.597a1.875 1.875 0 00.432 2.385l.84.692c.095.078.17.229.154.43a7.598 7.598 0 000 1.139c.015.2-.059.352-.153.43l-.841.692a1.875 1.875 0 00-.432 2.385l.922 1.597a1.875 1.875 0 002.282.818l1.019-.382c.115-.043.283-.031.45.082.312.214.641.405.985.57.182.088.277.228.297.35l.178 1.071c.151.904.933 1.567 1.85 1.567h1.844c.916 0 1.699-.663 1.85-1.567l.178-1.072c.02-.12.114-.26.297-.349.344-.165.673-.356.985-.57.167-.114.335-.125.45-.082l1.02.382a1.875 1.875 0 002.28-.819l.923-1.597a1.875 1.875 0 00-.432-2.385l-.84-.692c-.095-.078-.17-.229-.154-.43a7.614 7.614 0 000-1.139c-.016-.2.059-.352.153-.43l.84-.692c.708-.582.891-1.59.433-2.385l-.922-1.597a1.875 1.875 0 00-2.282-.818l-1.02.382c-.114.043-.282.031-.449-.083a7.49 7.49 0 00-.985-.57c-.183-.087-.277-.227-.297-.348l-.179-1.072a1.875 1.875 0 00-1.85-1.567h-1.843zM12 15.75a3.75 3.75 0 100-7.5 3.75 3.75 0 000 7.5z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </button>
      </div>
    </div>
  </nav>
  );
}

export default HeaderComponent
