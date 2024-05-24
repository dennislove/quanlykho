import React, { useEffect, useState } from 'react'
import { database, ref, set, push, serverTimestamp } from '../../App';
import { getDatabase, child, get } from 'firebase/database';

function FormAddCategory() {

    const [nameID, setNameID] = useState('');
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState('');

    useEffect(() => {
      const dbRef = ref(getDatabase());
    
      get(child(dbRef, `Locations`))
          .then((snapshot) => {
              if (snapshot.exists()) {
                  const fetchedLocations = Object.entries(snapshot.val()).map(([id, value]) => ({
                    ...value,
                      id
                  }));
                  setLocation(fetchedLocations);
              } else {
                  console.log("No data available in Locations");
              }
          })
          .catch((error) => {
              console.error(error);
          });
    }, []);

  const handleNameIDChange = (event) => {
    const newNameID = event.target.value;
    setNameID(newNameID);
};

const handleCategoryChange = (event) => {
  const newCategory = event.target.value;
  setCategory(newCategory);
};
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !nameID || !category) 
    return(
      alert("Please enter complete information")
    );

    const newsRef = push(ref(database, 'Category'));
    set(newsRef, {
      nameID: nameID,
      category: category,
      location: selectedLocation,
      createdAt: serverTimestamp()
    }).then(() => {
      alert('Data uploaded successfully!');
    }).catch((error) => {
      alert('Failed to upload data:', error);
    });
  };
  
    return(
      <form className=" space-y-6 border-2 p-6 bg-white rounded-lg" onSubmit={handleSubmit} >
      <div className="rounded-md shadow-sm ">
      <h1 className=' font-bold text-center mb-10'>Thêm Danh Mục</h1>
        <div className=" flex flex-col gap-3 my-3">
         <div className=' flex gap-6'>
         <div className=' flex flex-col grow'>
            <label htmlFor="">Tên danh mục</label>
               <input
                type="text"
                id="title"
                className="form-control  outline-none focus:border-black border rounded-lg p-2"
                placeholder="Tên danh mục"
                value={nameID}
                onChange={handleNameIDChange}
                />
         </div>
         <div className=' flex flex-col grow'>
            <label htmlFor="">Mã danh mục</label>
                <input
              type="text"
              id="title"
              className="form-control  outline-none focus:border-black border rounded-lg p-2"
              placeholder="Mã danh mục"
              value={category}
              onChange={handleCategoryChange}
              />
              </div>
              <div className=' flex flex-col grow'>
            <label htmlFor="">Mã khu vực</label>
                 <select name="category" id="category-select" className='grow border focus:border-black rounded-lg p-2 '
                 value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)} >
                  <option value="">Mã khu vực</option>
                 {location.map((item, index) => (
                  <option key={index} value={item.areaID}>
                      {item.areaName}
                  </option>
              ))}
          </select>
          </div>
         </div>
       
        </div>
        <button type="submit" className='py-3 w-full  bg-[#6366f1] text-white font-rob mt-4 rounded-lg' >Thêm</button>
      </div>
    </form>
    )
}

export default FormAddCategory
