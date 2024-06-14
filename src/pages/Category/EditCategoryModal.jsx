import React, { useState } from 'react';
import Modal from 'react-modal';
// import './EditCategoryModal.scss'; // Import the SCSS file

Modal.setAppElement('#root');

function EditCategoryModal({ isOpen, onRequestClose, category, onSave }) {
  const [categoryData, setCategoryData] = useState(category);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setCategoryData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSave(categoryData);
    console.log('categoryData', categoryData)
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 animate-fadeIn"
      overlayClassName="modal-overlay"
    >
     <div className='bg-white p-5 rounded-lg w-[400px] max-w-[90%] shadow-[0_5px_15px_rgba(208,203,203,0.3)]'>
           <h2 className="text-lg font-semibold text-gray-800 mb-5 text-center">Chỉnh sửa danh mục</h2>
          <form className="flex flex-col gap-4">
              <label className="text-base text-gray-600">Mã danh mục</label>
              <input
                type="text"
                name="category"
                value={categoryData.category || ''}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded text-base focus:outline-none bg-gray-200"
                readOnly
              />
              <label className="text-base text-gray-600">Tên danh mục</label>
              <input
                type="text"
                name="nameID"
                value={categoryData.nameID || ''}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded text-base"
              />
              <label className="text-base text-gray-600">Mã khu vực</label>
              <input
                type="text"
                name="location"
                value={categoryData.location || ''}
                onChange={handleChange}
                className="p-2 border border-gray-300 rounded text-base"
              />
              <div className="flex justify-between mt-5">
                <button type="button" onClick={handleSubmit} className="px-5 py-2 rounded text-base cursor-pointer bg-blue-400 text-white hover:bg-blue-500">Cập nhật</button>
                <button type="button" onClick={onRequestClose} className="px-5 py-2 rounded text-base cursor-pointer bg-gray-700 text-white hover:bg-gray-800">Đóng</button>
              </div>
            </form>
     </div>
    </Modal>
  );
}

export default EditCategoryModal;