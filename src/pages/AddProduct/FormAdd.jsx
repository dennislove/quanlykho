import React, { useEffect, useState } from 'react'
import {  storage, ref, set, push, storageRef, uploadBytes, getDownloadURL, serverTimestamp } from '../../App';
import { getDatabase, child, get, remove } from 'firebase/database';

function FormAdd() {
    const [title, setTitle] = useState('');
    const [nameID, setNameID] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [unit, setUnit] = useState('');
    const [quantity, setQuantity] = useState(0);
    const [price, setPrice] = useState('');
    const [descriptions, setDescriptions] = useState('');
    const [image, setImage] = useState("");
    
const handleUploadFile = (event) => {
        // Kiểm tra nếu có file được chọn
        if (event.target.files.length > 0) {
          setImage(event.target.files[0]);
        //   console.log("File has been uploaded:", event.target.files[0]);
        } else {
          setImage(null);
          console.log("No file uploaded.");
        }
      };

useEffect(() => {
  const dbRef = ref(getDatabase());

  get(child(dbRef, `Category`))
      .then((snapshot) => {
          if (snapshot.exists()) {
              const fetchedCategories = Object.entries(snapshot.val()).map(([id, value]) => ({
                ...value,
                  id
              }));
              setCategories(fetchedCategories);
          } else {
              console.log("No data available in Category");
          }
      })
      .catch((error) => {
          console.error(error);
      });
}, []);

const handleTitleChange = (event) => {
  const newTitle = event.target.value;
  setTitle(newTitle);
};
const handleNameIDChange = (event) => {
const newNameID = event.target.value;
setNameID(newNameID);
};
const handleUnitChange = (event) => {
  const newUnit = event.target.value;
  setUnit(newUnit);
};

const handlePriceChange = (event) => {
  const newPrice = event.target.value;
  setPrice(newPrice);
};

const handleDescriptionChange = (event) => {
  const newDescriptions = event.target.value;
  setDescriptions(newDescriptions);
};

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameID || !title || !unit || !categories || !price || !descriptions) 
      return(
        alert("Please enter complete information")
      );
    const imageRef = storageRef(storage, `images/${image.name}`);
    const snapshot = await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(snapshot.ref);

   
      const newsRef = push(ref(getDatabase(), 'Products'));
      set(newsRef, {
        name: title,
        productCode: nameID,
        unit: unit,
        quantity: quantity,
        categoryCode: selectedCategory,
        price: price,
        descriptions: descriptions,
        image: imageUrl,
        createdAt: serverTimestamp()
      }).then(() => {
        alert('Data uploaded successfully!');
      }).catch((error) => {
        alert('Failed to upload data:', error);
      });
    
   
  };

  return (
    <div>
    <form className=" space-y-6 border-2 p-6 bg-white rounded-lg" onSubmit={handleSubmit} >
    <div className="rounded-md shadow-sm ">
    <h1 className=' font-bold text-center mb-10 text-xl uppercase'>Thêm sản phẩm mới</h1>

      <div className=" flex flex-col gap-3 my-3">
       <div className=' flex gap-6'>
       <div className=' flex flex-col grow'>
        <label htmlFor="">Tên sản phẩm</label>
            <input
            type="text"
            id="title"
            className="form-control  outline-none focus:border-black border rounded-lg p-2"
            placeholder="Tên sản phẩm"
            value={title}
            onChange={handleTitleChange}
            />
            </div>
            <div className=' flex flex-col grow'>
        <label htmlFor="">Mã sản phẩm</label>
           <input
            type="text"
            id="title"
            className="form-control  outline-none focus:border-black border rounded-lg p-2"
            placeholder="Mã sản phẩm"
            value={nameID}
            onChange={handleNameIDChange}
            />
            </div>
            <div className=' flex flex-col grow'>
        <label htmlFor="">Mã danh mục</label>
             <select name="category" id="category-select" className='grow border focus:border-black rounded-lg p-2 '
             value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)} >
              <option value="">Mã danh mục</option>
             {categories.map((item, index) => (
              <option key={index} value={item.category}>
                  {item.category}
              </option>
          ))}
      </select>
      </div>
       </div>
         <div className='flex gap-10'>
         <div className=' flex flex-col grow'>
        <label htmlFor="">Đơn vị tính</label>
              <input
            type="text"
            id="title"
            className="form-control outline-none focus:border-black border rounded-lg p-2"
            placeholder="Đơn vị tính"
            value={unit}
            onChange={handleUnitChange}
            />
            </div>
          
                <div className=' flex flex-col grow'>
            <label htmlFor="">Số lượng nhập</label>
                  <input
                type="number"
                id="title"
                className="form-control outline-none focus:border-none border bg-gray-200 rounded-lg p-2"
                readOnly
                placeholder="Số lượng nhập"
                value={quantity}
                />
                </div>
            <div className=' flex flex-col grow'>
        <label htmlFor="">Giá nhập</label>
              <input
            type="number"
            id="title"
            className="form-control outline-none focus:border-black border rounded-lg p-2"
            placeholder="Giá nhập"
            value={price}
            onChange={handlePriceChange}
            />
            </div>
         </div>
        <div className=' flex gap-4'>
           <div className=' flex flex-col grow'>
          <label htmlFor="">Mô tả</label>
                    <textarea
                        className="form-control outline-none focus:border-black border rounded-lg p-2 h-[100px]"
                        placeholder="Mô tả"
                        value={descriptions}
                        onChange={handleDescriptionChange}
                    />
                
               
             </div>
           
        </div>
      </div>
      
      <div className="custom-file">
      <input type="file"  onChange={handleUploadFile} />
      
    </div>
    </div>

  <button type="submit" className='py-3 w-full  bg-[#6366f1] text-white font-rob mt-4 rounded-lg' >Thêm mới</button>

  </form>
 
 </div>
  )
}

export default FormAdd
