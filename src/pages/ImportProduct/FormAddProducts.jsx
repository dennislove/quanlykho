import React, { useEffect, useState } from 'react'
import {  ref, set, push,  auth } from '../../App';
import { getDatabase, get, query, orderByChild, equalTo, update } from 'firebase/database';
function FormAddProducts() {

    const [title, setTitle] = useState('');
    const [nameID, setNameID] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [unit, setUnit] = useState('');
    const [quantity, setQuantity] = useState('');
    const [quantityImpt, setQuantityImpt] = useState('');
    const [price, setPrice] = useState('');
    const [descriptions, setDescriptions] = useState("");
    const [reasonMistake, setReasonMistake] = useState("Không có")

    const [code, setCode] = useState("");
    const [delivery, setDelivery] = useState("")
    const [exportCode, setExportCode] = useState("")
    const [temporaryData, setTemporaryData] = useState([]);
    const [currentDate, setCurrentDate] = useState(new Date().toLocaleDateString());
    
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(true);

    useEffect(() => {
        const dbRef = ref(getDatabase(), 'Products');
        get(dbRef).then((snapshot) => {
            if (snapshot.exists()) {
                const productsArray = [];
                snapshot.forEach((childSnapshot) => {
                    const product = { id: childSnapshot.key, ...childSnapshot.val() };
                    productsArray.push(product);
                });
                setProducts(productsArray);
            } else {
                console.log("No data available");
            }
        }).catch((error) => {
            console.error(error);
        });
    }, []);

    const handleProductNameChange = (event) => {
        const productName = event.target.value;
        const foundProduct = products.find(product => product.name === productName);
        setSelectedProduct(foundProduct);
        // setNameID(productCode);
    };

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

useEffect(() => {
  if (selectedProduct) {
      setTitle(selectedProduct.name);
      setNameID(selectedProduct.productCode);
      setUnit(selectedProduct.unit);
      setQuantity(selectedProduct.quantity);
      setQuantityImpt(selectedProduct.quantityImpt)
      setPrice(selectedProduct.price);
      setSelectedCategory(selectedProduct.categoryCode);
      setDescriptions(selectedProduct.descriptions);
      setReasonMistake(selectedProduct.reasonMistake);

  }
}, [selectedProduct]); 

const handleSaveTemporary = async () => {
  if (!quantity || !quantityImpt || !price) {
      alert("Hãy nhâp đủ thông tin");
      return;
  }
  console.log("Saving data", {title, nameID, unit, quantity, quantityImpt, price, selectedCategory,delivery, code, exportCode});
  // Save data to temporary state
  setTemporaryData([...temporaryData, {
      title, nameID, unit, quantity, quantityImpt, price, selectedCategory, descriptions, reasonMistake, delivery, code, exportCode
  }]);
};
const getFormattedDateTime = () => {
  const date = new Date();
  return date.toLocaleString('en-GB', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  }).replace(/\/|,|:/g, '-');
};
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!nameID || !title || !unit || !quantity || !price) {
    alert("Hãy nhập đủ thông tin");
    return;
  }

  const db = getDatabase();
  const productsRef = ref(db, 'Products');

  const user = auth.currentUser;
const userEmail = user ? user.email : 'Unknown User';

  // lưu session để lấy phiếu nhập
  const sessionId = getFormattedDateTime(); // Sử dụng timestamp làm session ID
  const sessionRef = ref(db, `SessionsImp/${sessionId}`);
  for (let data of temporaryData) {
    // Ensure that undefined values are converted to null or given default values
    const cleanedData = {
      title: data.title || '',
      nameID: data.nameID || '',
      unit: data.unit || '',
      quantity: data.quantity || 0,
      quantityImpt: data.quantityImpt || 0,
      price: data.price || 0,
      selectedCategory: data.selectedCategory || '',
      descriptions: data.descriptions || '',
      reasonMistake: data.reasonMistake || "Không có",  // Convert undefined to null

      delivery: data.delivery || '',
      code: data.code || '',
      exportCode: data.exportCode || '',
      user: userEmail
    };
// Lưu dữ liệu vào session
    push(sessionRef, cleanedData);

    const queryRef = query(productsRef, orderByChild('productCode'), equalTo(cleanedData.nameID));

    get(queryRef).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const productRef = ref(db, `Products/${childSnapshot.key}`);
          const updates = {
            quantity: (Number(childSnapshot.val().quantity) || 0) + (Number(cleanedData.quantityImpt) || 0),
            reasonMistake: cleanedData.reasonMistake,
            delivery: cleanedData.delivery,
            code: cleanedData.code,
            exportCode: cleanedData.exportCode
          };
          update(productRef, updates).then(() => {
            alert('Cập nhật số lượng và thông tin chi tiết thành công');
          }).catch((error) => {
            alert('Lỗi cập nhật thông tin');
          });
        });
      } else {
        alert('Không tìm thấy sản phẩm');
      }
    }).catch((error) => {
      alert('Lỗi truy vấn sản phẩm');
    });
  }
  setTemporaryData([]); // Clear temporary data after uploading
};

const handleDeleteItem = (index) => {
  const newData = temporaryData.filter((item, idx) => idx !== index);
  setTemporaryData(newData);
}
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
                  value={delivery}
                  readOnly
                  />
          </div>
          
          <div className=" flex flex-col gap-3 my-3">
           <div className=' flex flex-col'>
            <label htmlFor="">Tên sản phẩm</label>
                <input
                type="text"
                id="title"
                className="form-control  outline-none focus:border-black border rounded-lg p-2"
                placeholder="Tên sản phẩm"
                // value={title}
                onChange={handleProductNameChange}
                />
                </div>
           
           {selectedProduct && (
            <>
            <div className=' flex gap-6'>
                
                <div className='flex gap-6'>
                     <div className=' flex flex-col grow'>
                 <label htmlFor="">Mã sản phẩm</label>
                    <input
                     type="text"
                     id="title"
                     className="form-control  outline-none bg-gray-200 rounded-lg p-2"
                     placeholder="Mã sản phẩm"
                     value={selectedProduct.productCode}
                     readOnly
                     />
                     </div>
                     <div className=' flex flex-col grow'>
                 <label htmlFor="">Mã danh mục</label>
                    <input
                     type="text"
                     id="title"
                     className="form-control  outline-none  bg-gray-200 rounded-lg p-2"
                     placeholder="Mã danh mục"
                     value={selectedProduct.categoryCode}
                     readOnly
                     />
                     </div>
                </div>
                
            </div>
               <div className='flex gap-10'>
               <div className=' flex flex-col grow'>
              <label htmlFor="">Đơn vị tính</label>
                    <input
                  type="text"
                  id="title"
                  className="form-control outline-none bg-gray-200 rounded-lg p-2"
                  placeholder="Đơn vị tính"
                  value={selectedProduct.unit}
                  readOnly
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
                          <textarea
                              className="form-control outline-none bg-gray-200 rounded-lg p-2 h-[100px]"
                              placeholder="Mô tả"
                              value={selectedProduct.descriptions}
                              readOnly
                          />
                  
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
            </>
            )}
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
              <h2 onClick={() => handleDeleteItem(index)}  className="font-medium cursor-pointer text-red-600 dark:text-red-500 hover:underline ml-4">Xóa</h2>
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

export default FormAddProducts
