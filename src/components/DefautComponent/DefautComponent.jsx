import React, { useEffect, useState } from 'react';
import { auth } from '../../App';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from "firebase/database";

import Dashboard from './Dashboard';
import DashboardImpt from './DashboardImpt';
import DashboardExpt from './DashboardExpt';

function DefautComponent({ children }) {
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
                return <Dashboard />;
            case 'Nhân viên nhập':
                return <DashboardImpt />;
            case 'Nhân viên xuất':
                return <DashboardExpt />;
            default:
                return null; // or any default view
        }
    }

    return (
        <div className='flex min-w-screen bg-gray-50'>
            {renderDashboard()}

          <div className='p-4 w-full'>
              {children} 
            </div>
        </div>
    );
}

export default DefautComponent;
