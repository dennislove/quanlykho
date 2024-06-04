import { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';

const SessionViewer = () => {
  const [sessions, setSessions] = useState({});

  useEffect(() => {
    const db = getDatabase();
    const sessionRef = ref(db, 'SessionsExp');

    // Function to handle data snapshot
    const handleSnapshot = (snapshot) => {
      if (snapshot.exists()) {
        setSessions(snapshot.val());
      } else {
        setSessions({});
      }
    };

    // Listening to the data changes
    const listener = onValue(sessionRef, handleSnapshot, (error) => {
      console.error('Firebase read failed: ' + error.code);
    });

    // Cleanup function to remove the listener
    return () => {
      if (sessionRef && typeof sessionRef.off === 'function') {
        sessionRef.off('value', listener);
      }
    };
  }, []);

  

  return (
    <div>
      <h1>Phiếu xuất kho trước đó</h1>
      {Object.entries(sessions).map(([sessionId, products]) => (
        <div key={sessionId} className='mt-3'>
          <h2>Ngày xuất kho: {sessionId}</h2>
          {Object.values(products).slice(0,1).map((product, index) => (
          <div>
            <h2 key={index}>Mã xuất kho: {product.exportCode}</h2>
            <h2 key={index}>Người xuất kho: {product.userExp}</h2>
            <h2 key={index}>Lý do xuất kho: {product.reasonExp}</h2>
        </div>
          ))}

             <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="py-3 px-6">
                  #
                </th>
                <th scope="col" className="py-3 px-6">
                  Mã sản phẩm
                </th>
                <th scope="col" className="py-3 px-6">
                  Tên sản phẩm
                </th>
                <th scope="col" className="py-3 px-6">
                  Mã danh mục
                </th>
                <th scope="col" className="py-3 px-6">
                  Đơn vị
                </th>
                <th scope="col" className="py-3 px-6">
                  SL xuất
                </th>
                <th scope="col" className="py-3 px-6">
                  Đơn giá
                </th>
              
              </tr>
            </thead>
        <tbody>
        {Object.values(products).map((product, index) => (
            <tr key={ index +1} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="py-4 px-6">
             { index +1}
            </td>
            <td className="py-4 px-6">
              {product.title}
            </td>
            <td className="py-4 px-6">
            {product.nameID}
            </td>
            <td className="py-4 px-6">
              {product.selectedCategory}
            </td>
            <td className="py-4 px-6">
              {product.unit}
            </td>
            <td className="py-4 px-6">
              {product.quantityExp}
            </td>
            <td className="py-4 px-6">
              {product.price}
            </td>
          
          </tr>
          ))}
        </tbody>
      </table>
        </div>
      ))}
    </div>
  );
};

export default SessionViewer;
