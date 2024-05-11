import React, { useEffect, useState } from 'react'
import { getDatabase, ref, child, get, set, remove } from "firebase/database";
import { Link } from 'react-router-dom'

function ManageAccount() {
    const [showForm, setShowForm] = useState(false); // useState hook để lưu trữ trạng thái hiển thị (mặc định là false)
    const [currentItem, setCurrentItem] = useState(null);

    const [query, setQuery] =useState("") //luu gia tri khi search
    
  
    // select database
    const [media, setMedia] = useState([]);
    const [filteredMedia, setFilteredMedia] = useState([]);

    useEffect(() => {
      const dbRef = ref(getDatabase());
  
      get(child(dbRef, `Users`))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const fetchedMedia = Object.entries(snapshot.val()).map(([id, value]) => ({
              ...value,
              id, // đây là ID từ Firebase
              createdAt: new Date(value.createdAt).toLocaleString()
            }));
            setMedia(fetchedMedia);
           
          } else {
            console.log("No data available in Media");
          }
        })
        .catch((error) => {
          console.error(error);
        });
    }, []);

  useEffect(() => {
    // Lọc media dựa trên giá trị tìm kiếm
    const results = media.filter(item =>
      item.email.toLowerCase().includes(query) 
    );
    setFilteredMedia(results);
  }, [query, media]); 
  
    const handleEditMedia = (mediaId) => {
      const item = media.find(item => item.id === mediaId);
      if (item) {
        setCurrentItem(item); // Set the current item to the one to be edited
        setShowForm(true); // Show the form
      }
    };
    const handleDeleteMedia = (mediaId) => {
      const db = getDatabase();
      const mediaRef = ref(db, `Users/${mediaId}`);
    
      remove(mediaRef)
        .then(() => {
          console.log(`Media item with ID: ${mediaId} has been deleted.`);
          // Cập nhật state nếu cần
          setMedia((currentMedia) => currentMedia.filter((item) => item.id !== mediaId));
        })
        .catch((error) => {
          console.error("Error deleting media item:", error);
        });
    };
     return (
      <div className="mt-12 mb-8 flex flex-col gap-4">
        <div className="relative bg-clip-border mx-4 rounded-xl overflow-hidden bg-gradient-to-tr from-gray-900 to-gray-800 text-white shadow-gray-900/20 shadow-lg -mt-6 mb-2 p-6">
          <h6 className="block antialiased tracking-normal font-sans text-base font-semibold leading-relaxed text-white">
            Management Account
          </h6>
        </div>
       <div>
       <Link to="/admin/api/sign-up" 
            className=" cursor-pointer relative lg:px-8 md:px-6 lg:py-3 md:py-2 pm:px-6 pm:py-2 border-2 border-indigo-500 font-semibold text-white rounded-lg transition-all bg-indigo-500
            duration-1000 ease-in-out inline-block overflow-hidden capitalize shadow-md hover:bg-transparent hover:text-indigo-500
            before:absolute before:-left-[100%] hover:before:left-full before:top-0 before:w-full before:h-full
        before:bg-gradient-to-r before:from-transparent before:via-white before:to-transparent before:transition-all before:duration-500 before:ease-linear">
        Add Admin Account
        </Link>
       </div>
         {/* ----------table------------ */}
         
         <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th scope="col" className="py-3 px-6">
                    #
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Email
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Authentication
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Created At
                  </th>
                  <th scope="col" className="py-3 px-6">
                    Function
                  </th>
                </tr>
              </thead>
              <tbody>
                {/* Example row */}
                {filteredMedia.map((item, index) => (
                <tr key={index+1} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <td className="py-4 px-6">
                   {index+1}
                  </td>
                  <td className="py-4 px-6">
                    {item.email}
                  </td>
                  <td className="py-4 px-6">
                    {item.auth}
                  </td>
                  <td className="py-4 px-6">
                    {item.createdAt}
                  </td>
                  <td className="py-4 px-6 flex">
                    <h2 onClick={() => handleEditMedia(item.id)} className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">Edit</h2>
                    <h2 onClick={() => handleDeleteMedia(item.id)} className="font-medium cursor-pointer text-red-600 dark:text-red-500 hover:underline ml-4">Delete</h2>
                  </td>
                </tr>
                   ))}
                {/* Dynamic rows should be generated here based on data */}
              </tbody>
            </table>
          </div>
  </div>
  )
}

export default ManageAccount
