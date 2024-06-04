import React, { useEffect, useState } from 'react'
import {  ref, set, push,  serverTimestamp, auth } from '../../App';
import { getDatabase, get, query, orderByChild, equalTo, update } from 'firebase/database';
function FormExpProduct() {

    const [title, setTitle] = useState('');
    const [nameID, setNameID] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [unit, setUnit] = useState('');
    const [quantityExp, setQuantityExp] = useState('');
    const [price, setPrice] = useState('');
    const [descriptions, setDescriptions] = useState("");

    const [exportCode, setExportCode] = useState("")
    const [receiver, setReceiver] = useState("")
    const [reasonExp, setReasonExp] = useState("")

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
  const totalMoney = temporaryData.reduce((total, item) => total + (item.price * item.quantityExp), 0);

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
  setQuantityExp(newQuantity);
};

const handleReasonExport = (event) => {
  const newReaSonExp = event.target.value;
  setReasonExp(newReaSonExp);
};
const handleDeliveryChange = (event) => {
  const newReceiver = event.target.value;
  setReceiver(newReceiver);
};
const handleExpCodeChange = (event) => {
  const newExpCode = event.target.value;
  setExportCode(newExpCode);
};

useEffect(() => {
  if (selectedProduct) {
      setTitle(selectedProduct.name);
      setNameID(selectedProduct.productCode);
      setUnit(selectedProduct.unit);
      setQuantityExp(selectedProduct.quantityExp);
      setPrice(selectedProduct.price);
      setSelectedCategory(selectedProduct.categoryCode);
      setDescriptions(selectedProduct.descriptions);
  }
}, [selectedProduct]); 

const handleSaveTemporary = async () => {
  if (!quantityExp || !title) {
    alert("Hãy nhập đủ thông tin");
    return;
  }
  const db = getDatabase();
  const productRef = ref(db, 'Products/');
  const snapshot = await get(productRef);
  
  if (!snapshot.exists()) {
    alert("Sản phẩm không có");
    return;
  }
  
  const products = snapshot.val();
  let isTitleMatch = false;
  let availableQuantity = 0;
  
  // Loop through all products to find a match for the given title
  for (const id in products) {
    const product = products[id];
    if (product.name === title) {
      availableQuantity = product.quantity; // Assuming 'quantity' is the field for available stock
      isTitleMatch = true;
      break;
    }
  }
  
  if (!isTitleMatch) {
    alert("Không tìm thấy sản phẩm với tên đã nhập");
    return;
  }
  
  // Check if the requested quantity is less than the available quantity
  if (quantityExp > availableQuantity) {
    alert(`Số lượng yêu cầu vượt quá số lượng có sẵn. Có sẵn: ${availableQuantity}`);
    return;
  }
  console.log("Saving data", { title, nameID, unit, quantityExp, price, selectedCategory, receiver, reasonExp, exportCode });

  // Save data to temporary state
  setTemporaryData([...temporaryData, {
    title, nameID, unit, quantityExp, price, selectedCategory, descriptions, receiver, reasonExp, exportCode
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
  if (!nameID || !title || !unit || !quantityExp || !price) {
    alert("Hãy nhập đủ thông tin");
    return;
  }

  const db = getDatabase();
  const productsRef = ref(db, 'Products');

  const user = auth.currentUser;
const userEmail = user ? user.email : 'Unknown User';
  const sessionId = getFormattedDateTime(); // Sử dụng timestamp làm session ID
  const sessionRef = ref(db, `SessionsExp/${sessionId}`);

  for (let data of temporaryData) {
    // Ensure that undefined values are converted to null or given default values
    const cleanedData = {
      title: data.title || '',
      nameID: data.nameID || '',
      unit: data.unit || '',
      quantityExp: data.quantityExp || 0,
      price: data.price || 0,
      selectedCategory: data.selectedCategory || '',
      descriptions: data.descriptions || '',

      receiver: data.receiver || '',
      reasonExp: data.reasonExp || '',
      exportCode: data.exportCode || '',
      userExp: userEmail
    };

    push(sessionRef, cleanedData);
    const queryRef = query(productsRef, orderByChild('productCode'), equalTo(cleanedData.nameID));

    get(queryRef).then((snapshot) => {
      if (snapshot.exists()) {
        snapshot.forEach((childSnapshot) => {
          const productRef = ref(db, `Products/${childSnapshot.key}`);
          const updates = {
            quantity: (Number(childSnapshot.val().quantity) || 0) - (Number(cleanedData.quantityExp) || 0),
            receiver: cleanedData.receiver,
            reasonExp: cleanedData.reasonExp,
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
        <h1 className=' font-bold text-center mb-10 text-xl uppercase'>Phiếu xuất kho</h1>
  
            <h1 className='text-center mb-10 text-gray-500'>Số: 
            <input
                  type="text"
                  id="title"
                  className="form-control border-b focus:border-b-black outline-none "
                  value={exportCode}
                  onChange={handleExpCodeChange}
                  />
            </h1>
           
         <div className='border-b-2 border-black'>
            <h1 className=' mb-10 flex text-gray-500 gap-2'>Người nhận: 
            <input
                  type="text"
                  id="title"
                  className="form-control border-b focus:border-b-black text-black outline-none w-3/4"
                  value={receiver}
                  onChange={handleDeliveryChange}
                  />
            </h1>
            <h1 className=' mb-10 flex text-gray-500 gap-2 '>Lý do xuất kho: 
            <input
                  type="text"
                  id="title"
                  className="form-control border-b focus:border-b-black text-black outline-none w-3/4"
                  value={reasonExp}
                  onChange={handleReasonExport}
                  />
            </h1>
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
              <label htmlFor="">Số lượng xuất</label>
                    <input
                  type="number"
                  id="title"
                  className="form-control outline-none focus:border-black border rounded-lg p-2"
                  placeholder="Số lượng xuất"
                  value={quantityExp}
                  onChange={handleQuantityChange}
                  />
                  </div>
                  
                  <div className=' flex flex-col grow'>
              <label htmlFor="">Giá xuất</label>
                    <input
                  type="number"
                  id="title"
                  className="form-control outline-none bg-gray-200 rounded-lg p-2"
                  placeholder="Giá xuất"
                  value={selectedProduct.price}
                  readOnly
                  // onChange={handlePriceChange}
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
              {item.quantityExp}
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
      <button type="submit" className='py-3 w-full  bg-[#6366f1] text-white font-rob mt-4 rounded-lg' >Xuất kho</button>

      </form>
     
     </div>
    )
}

export default FormExpProduct
