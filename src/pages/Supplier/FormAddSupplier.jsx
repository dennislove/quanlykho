import React, { useState } from 'react'
import { database, storage, ref, set, push, storageRef, uploadBytes, getDownloadURL, serverTimestamp } from '../../App';

function  FormAddSupplier() {

    const [nameID, setNameID] = useState('');
    const [category, setCategory] = useState('');
    const [hotline, setHotline] = useState('');
    const [taxCode, setTaxCode] = useState('');
    const [address, setAddress] = useState('');

  const handleNameIDChange = (event) => {
    const newNameID = event.target.value;
    setNameID(newNameID);
};

const handleCategoryChange = (event) => {
  const newCategory = event.target.value;
  setCategory(newCategory);
};
const handleHotlineChange = (event) => {
  const newHotline = event.target.value;
  setHotline(newHotline);
};
const handleTaxCodeChange = (event) => {
  const newTaxCode = event.target.value;
  setTaxCode(newTaxCode);
};

const handleAddressChange = (event) => {
  const newAddress = event.target.value;
  setAddress(newAddress);
};
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !nameID || !category || !address || !hotline || !taxCode) 
    return(
      alert("Please enter complete information")
    );

    const newsRef = push(ref(database, 'Suppliers'));
    set(newsRef, {
      nameID: nameID,
      category: category,
      hotline: hotline,
      taxCode: taxCode,
      address: address,
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
            <label htmlFor="">Tên nhà cung cấp</label>
               <input
                type="text"
                id="title"
                className="form-control  outline-none focus:border-black border rounded-lg p-2"
                placeholder="Tên nhà cung cấp"
                value={nameID}
                onChange={handleNameIDChange}
                />
         </div>
         <div className=' flex flex-col grow'>
            <label htmlFor="">Mã nhà cung cấp</label>
                <input
              type="text"
              id="title"
              className="form-control  outline-none focus:border-black border rounded-lg p-2"
              placeholder="Mã nhà cung cấp"
              value={category}
              onChange={handleCategoryChange}
              />
              </div>
              <div className=' flex flex-col grow'>
            <label htmlFor="">Mã số thuế</label>
               <input
              type="text"
              id="title"
              className="form-control  outline-none focus:border-black border rounded-lg p-2"
              placeholder="Mã số thuế"
              value={taxCode}
              onChange={handleTaxCodeChange}
              />
              </div>
         </div>
         <div className=' flex gap-6'>
         <div className=' flex flex-col grow'>
            <label htmlFor="">Hotline</label>
               <input
                type="text"
                id="title"
                className="form-control  outline-none focus:border-black border rounded-lg p-2"
                placeholder="Hotline"
                value={hotline}
                onChange={handleHotlineChange}
                />
         </div>
        
              <div className=' flex flex-col grow'>
            <label htmlFor="">Địa chỉ</label>
               <input
              type="text"
              id="title"
              className="form-control  outline-none focus:border-black border rounded-lg p-2"
              placeholder="Địa chỉ"
              value={address}
              onChange={handleAddressChange}
              />
              </div>
         </div>
             
        </div>
        <button type="submit" className='py-3 w-full  bg-[#6366f1] text-white font-rob mt-4 rounded-lg' >Thêm</button>
      </div>
    </form>
    )
}

export default FormAddSupplier
