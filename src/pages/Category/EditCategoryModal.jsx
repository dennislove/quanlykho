import React, { useState } from 'react';
import Modal from 'react-modal';
import './EditCategoryModal.scss'; // Import the SCSS file

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
      className="modal-content"
      overlayClassName="modal-overlay"
    >
      <h2 className="modal-title">Chỉnh sửa danh mục</h2>
      <form className="modal-form">
        <label className="modal-label">Mã danh mục</label>
        <input
          type="text"
          name="category"
          value={categoryData.category || ''}
          onChange={handleChange}
          className="modal-input"
          readOnly
        />
        <label className="modal-label">Tên danh mục</label>
        <input
          type="text"
          name="nameID"
          value={categoryData.nameID || ''}
          onChange={handleChange}
          className="modal-input"
        />
        <label className="modal-label">Mã khu vực</label>
        <input
          type="text"
          name="location"
          value={categoryData.location || ''}
          onChange={handleChange}
          className="modal-input"
        />
        <div className="modal-buttons">
          <button type="button" onClick={handleSubmit} className="modal-button-save">Cập nhật</button>
          <button type="button" onClick={onRequestClose} className="modal-button-close">Đóng</button>
        </div>
      </form>
    </Modal>
  );
}

export default EditCategoryModal;
