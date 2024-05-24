import React, { useState } from 'react'
import { database, ref, set, push, serverTimestamp } from '../../App';

function FormAddLocation() {

    const [areaID, setAreaID] = useState('');
    const [areaName, setAreaName] = useState('');
    const [status, setStatus] = useState("")

  const handleAreaIDChange = (event) => {
    const newAreaID = event.target.value;
    setAreaID(newAreaID);
};

const handleAreaNameChange = (event) => {
  const newAreaName = event.target.value;
  setAreaName(newAreaName);
};
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if ( !areaID || !areaName || !status) 
    return(
      alert("Please enter complete information")
    );

    const newsRef = push(ref(database, 'Locations'));
    set(newsRef, {
      areaID: areaID,
      areaName: areaName,
      status:status,
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
      <h1 className=' font-bold text-center mb-10'>Thêm Khu vực lưu trữ</h1>
        <div className=" flex flex-col gap-3 my-3">
         <div className=' flex gap-6'>
         <div className=' flex flex-col grow'>
            <label htmlFor="">Mã khu vực</label>
               <input
                type="text"
                id="title"
                className="form-control  outline-none focus:border-black border rounded-lg p-2"
                placeholder="Mã khu vực"
                value={areaID}
                onChange={handleAreaIDChange}
                />
         </div>
         <div className=' flex flex-col grow'>
            <label htmlFor="">Tên khu vực</label>
                <input
              type="text"
              id="title"
              className="form-control  outline-none focus:border-black border rounded-lg p-2"
              placeholder="Tên khu vực"
              value={areaName}
              onChange={handleAreaNameChange}
              />
              </div>
              <div className=' flex flex-col grow'>
            <label htmlFor="">Trạng thái</label>
                 <select name="locations" id="locations-select" className='grow border focus:border-black rounded-lg p-2 '
                 value={status} onChange={e => setStatus(e.target.value)} >
                  <option value="">---Trạng thái---</option>
                  <option value="Còn trống">Còn trống</option>
                  <option value="Sắp đầy">Sắp đầy</option>
                  <option value="Đầy">Đầy</option>
                
          </select>
          </div>
         </div>
             
        </div>
        <button type="submit" className='py-3 w-full  bg-[#6366f1] text-white font-rob mt-4 rounded-lg' >Thêm</button>
      </div>
    </form>
    )
}

export default FormAddLocation
