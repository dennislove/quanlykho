import React, { useEffect, useState } from 'react'
import { database, storage, ref, set, push, storageRef, uploadBytes, getDownloadURL, serverTimestamp } from '../../App';
import { getDatabase, child, get, remove } from 'firebase/database';
function FormAddNews() {

  const [news, setNews] = useState([]);

    const [title, setTitle] = useState('');
    const [nameID, setNameID] = useState('');
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [unit, setUnit] = useState('');
    const [quantity, setQuantity] = useState('');
    const [quantityImpt, setQuantityImpt] = useState('');
    const [price, setPrice] = useState('');
    const [descriptions, setDescriptions] = useState([{ desc: '' }]);
    const [image, setImage] = useState("");
    const [code, setCode] = useState("");
    const [delivery, setDelivery] = useState("")
    const [exportCode, setExportCode] = useState("")
    const [reasonMistake, setReasonMistake] = useState("Không có")
    const [temporaryData, setTemporaryData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
    
    function formatCurrencyVND(number) {
      return number.toLocaleString('vi-VN');
  }
  
  // Function to convert numbers to Vietnamese words
  function numberToVietnameseWords(number) {
      const under20 = ["không", "một", "hai", "ba", "bốn", "năm", "sáu", "bảy", "tám", "chín", "mười", "mười một", "mười hai", "mười ba", "mười bốn", "mười lăm", "mười sáu", "mười bảy", "mười tám", "mười chín"];
      const tens = ["", "", "hai mươi", "ba mươi", "bốn mươi", "năm mươi", "sáu mươi", "bảy mươi", "tám mươi", "chín mươi"];
      const chunks = ["", "ngàn", "triệu", "tỷ"];
  
      if (number === 0) return 'không đồng';
  
      if (number < 0) return 'âm ' + numberToVietnameseWords(-number);
  
      const words = [];
  
      // Process in chunks of thousands
      for (let i = 0; number > 0; i++) {
          const chunk = number % 1000;
  
          if (chunk) {
              let chunkStr = '';
  
              if (chunk < 100) {
                  if (chunk < 20) chunkStr = under20[chunk];
                  else chunkStr = tens[Math.floor(chunk / 10)] + (chunk % 10 ? " " + under20[chunk % 10] : "");
              } else {
                  const hundreds = Math.floor(chunk / 100);
                  const remainder = chunk - hundreds * 100;
                  chunkStr = under20[hundreds] + " trăm" + (remainder < 20 ? (remainder ? " lẻ " + under20[remainder] : "") : " " + tens[Math.floor(remainder / 10)] + (remainder % 10 ? " " + under20[remainder % 10] : ""));
              }
  
              words.unshift(chunkStr + " " + chunks[i]);
          }
  
          number = Math.floor(number / 1000);
      }
  
      return words.join(" ") + " đồng";
  }
  const totalMoney = temporaryData.reduce((total, item) => total + (item.price * item.quantity), 0);

// Format and convert to words
const formattedTotalMoney = formatCurrencyVND(totalMoney);
const totalMoneyInWords = numberToVietnameseWords(totalMoney);
    // Cập nhật ngày hiện tại khi component được mount
    useEffect(() => {
      const today = new Date().toLocaleDateString();
      setCurrentDate(today);
    }, []);

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
const handleQuantityChange = (event) => {
  const newQuantity = event.target.value;
  setQuantity(newQuantity);
};
const handleQuantityImptChange = (event) => {
  const newQuantityImpt = event.target.value;
  setQuantityImpt(newQuantityImpt);
};
const handlePriceChange = (event) => {
  const newPrice = event.target.value;
  setPrice(newPrice);
};
const handleCodeChange = (event) => {
  const newCode = event.target.value;
  setCode(newCode);
};
const handleDeliveryChange = (event) => {
  const newDelivery = event.target.value;
  setDelivery(newDelivery);
};
const handleExpCodeChange = (event) => {
  const newExpCode = event.target.value;
  setExportCode(newExpCode);
};
const handleReasonChange = (event) => {
  const newReason = event.target.value;
  setReasonMistake(newReason);
};
  const handleDescriptionChange = (index) => (event) => {
    const newDescriptions = descriptions.map((item, idx) => {
        if (idx === index) {
            return { ...item, desc: event.target.value };
        }
        return item;
    });
    setDescriptions(newDescriptions);
};
const handleAddDescription = () => {
  setDescriptions([...descriptions, { desc: '' }]);
};
const handleDeleteDescription = () => {
  if (descriptions.length > 1) {
      setDescriptions(descriptions.slice(0, -1));
  } 
};
  
const handleSaveTemporary = async () => {
    if (!title || !nameID || !unit || !quantity || !selectedCategory || !reasonMistake || descriptions.length === 0) {
      alert("Please enter complete information");
      return;
    }
    // Optionally upload image and get URL
    let imageUrl = "";
    if (image) {
      const imageRef = storageRef(storage, `images/${image.name}`);
      const snapshot = await uploadBytes(imageRef, image);
      imageUrl = await getDownloadURL(snapshot.ref);
    }
    // Save data to temporary state
    setTemporaryData([...temporaryData, {
      title,
      nameID,
      unit,
      quantity,
      price,
      selectedCategory,
      descriptions,
      imageUrl,
      reasonMistake,
      delivery,
      code,
      exportCode
    }]);

   
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nameID || !title || !unit || !quantity || !price || !image || !code || !delivery || !exportCode) 
      return(
        alert("Please enter complete information")
      );
    const imageRef = storageRef(storage, `images/${image.name}`);
    const snapshot = await uploadBytes(imageRef, image);
    const imageUrl = await getDownloadURL(snapshot.ref);

    for (let data of temporaryData) {
      const newsRef = push(ref(getDatabase(), 'Products'));
      set(newsRef, {
        name: data.title,
        productCode: data.nameID,
        unit: data.unit,
        categoryCode: data.selectedCategory,
        quantity: data.quantity,
        price: data.price,
        reasonMistake:data.reasonMistake,
        delivery:data.delivery,
        code: data.code,
        exportCode: data.exportCode,
        descriptions: data.descriptions.reduce((acc, item, index) => {
          acc[`description${index + 1}`] = item.desc;
          return acc;
        }, {}),
        image: imageUrl,
        createdAt: serverTimestamp()
      }).then(() => {
        alert('Data uploaded successfully!');
      }).catch((error) => {
        alert('Failed to upload data:', error);
      });
    }
    setTemporaryData([]); // Clear temporary data after uploading
  };
  const handleEditNews = (newsId) => {
    const item = news.find(item => item.id === newsId);
    if (item) {
     
    }
  };
  const handleDeleteNews = (newsId) => {
    const db = getDatabase();
    const newsRef = ref(db, `Category/${newsId}`);
  
    remove(newsRef)
      .then(() => {
        console.log(`News item with ID: ${newsId} has been deleted.`);
        // Cập nhật state nếu cần
        setNews((currentNews) => currentNews.filter((item) => item.id !== newsId));
      })
      .catch((error) => {
        console.error("Error deleting news item:", error);
      });
  };
    return(
     <div>
        <form className=" space-y-6 border-2 p-6 bg-white rounded-lg" onSubmit={handleSubmit} >
        <div className="rounded-md shadow-sm ">
        <h1 className=' font-bold text-center mb-10 text-xl uppercase'>Phiếu nhập kho</h1>
      
         
            <h1 className='text-center mb-10 text-gray-500'>Số: 
            <input
                  type="text"
                  id="title"
                  className="form-control border-b focus:border-b-black outline-none "
                  value={code}
                  onChange={handleCodeChange}
                  />
            </h1>
           
          <h1 className=' mb-10 flex text-gray-500 gap-2'>Người vận chuyển: 
          <input
                type="text"
                id="title"
                className="form-control border-b focus:border-b-black text-black outline-none w-3/4"
                value={delivery}
                onChange={handleDeliveryChange}
                />
          </h1>
          <div className=' flex justify-start items-start text-center gap-2 border-b-black border-b-2'>
            <h1 className=' mb-10 flex text-gray-500'>Theo hóa đơn số: </h1>
            <input
                  type="text"
                  id="title"
                  className="form-control border-b focus:border-b-black outline-none"
                  value={exportCode}
                  onChange={handleExpCodeChange}
                  />
                 ngày {currentDate} của 
                   <input
                  type="text"
                  id="title"
                  className="form-control border-b focus:border-b-black outline-none w-1/2"
                  value={ delivery}
                  readOnly
                  onChange={handleDeliveryChange}
                  />
          </div>
          
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
            <label htmlFor="">Số lượng chứng từ</label>
                  <input
                type="number"
                id="title"
                className="form-control outline-none focus:border-black border rounded-lg p-2"
                placeholder="Số lượng chứng từ"
                value={quantityImpt}
                onChange={handleQuantityImptChange}
                />
                </div>
                <div className=' flex flex-col grow'>
            <label htmlFor="">Số lượng nhập</label>
                  <input
                type="number"
                id="title"
                className="form-control outline-none focus:border-black border rounded-lg p-2"
                placeholder="Số lượng nhập"
                value={quantity}
                onChange={handleQuantityChange}
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
                {descriptions.map((item, index) => (
                        <textarea
                            key={index}
                            className="form-control outline-none focus:border-black border rounded-lg p-2 h-[100px]"
                            placeholder={`Mô tả ${index + 1}`}
                            value={item.desc}
                            onChange={handleDescriptionChange(index)}
                        />
                    ))}
                    
                    <div className='flex gap-3 mt-4'>
                      <button type='button' className=' bg-[#6366f1] text-white px-3 py-2 rounded-lg ' onClick={handleAddDescription}>Thêm mô tả</button>
                      {descriptions.length > 1 && (
                        <button type="button" className='border border-[#6366f1] text-[#6366f1] px-3 py-2 rounded-lg' onClick={handleDeleteDescription}>Xóa bớt</button>
                      )}
                     
                    </div>
                 </div>
                 <div className=' flex flex-col grow'>
                        <label htmlFor="">Lý do hỏng</label>
                      <textarea
                    type="text"
                    id="title"
                    className="form-control outline-none focus:border-black border rounded-lg p-2 h-[100px]"
                    placeholder="Lý do hỏng"
                    value={reasonMistake}
                    onChange={handleReasonChange}
                    />
                    </div>
            </div>
          </div>
          
          <div className="custom-file">
          <input type="file"  onChange={handleUploadFile} />
          
        </div>
        </div>
      <button type="button" className='border-2 bg-green-600 hover:bg-transparent hover:text-green-600 border-green-600  text-white px-3 py-2 rounded-lg ' onClick={handleSaveTemporary}>Thêm vào bảng</button>

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
                  Số lượng
                </th>
                <th scope="col" className="py-3 px-6">
                  Đơn giá
                </th>
                <th scope="col" className="py-3 px-6">
                  Chức năng
                </th>
              </tr>
            </thead>
        <tbody>
          {temporaryData.map((item, index) => (
            <tr key={ index +1} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
            <td className="py-4 px-6">
             { index +1}
            </td>
            <td className="py-4 px-6">
              {item.title}
            </td>
            <td className="py-4 px-6">
            {item.nameID}
            </td>
            <td className="py-4 px-6">
              {item.selectedCategory}
            </td>
            <td className="py-4 px-6">
              {item.unit}
            </td>
            <td className="py-4 px-6">
              {item.quantity}
            </td>
            <td className="py-4 px-6">
              {item.price}
            </td>
            <td className="py-4 px-6 flex">
              <h2 onClick={() => handleEditNews(item.id)} className="font-medium cursor-pointer text-blue-600 dark:text-blue-500 hover:underline">Sửa</h2>
              <h2 onClick={() => handleDeleteNews(item.id)} className="font-medium cursor-pointer text-red-600 dark:text-red-500 hover:underline ml-4">Xóa</h2>
            </td>
          </tr>
          ))}
        </tbody>
      </table>
      <h1>Tổng tiền: {formattedTotalMoney}VND</h1>
      <h1>Bằng chữ: {totalMoneyInWords}</h1>
      <button type="submit" className='py-3 w-full  bg-[#6366f1] text-white font-rob mt-4 rounded-lg' >Nhập kho</button>

      </form>
     
     </div>
    )
}

export default FormAddNews
