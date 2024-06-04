import React from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import FormExpProduct from './FormExpProduct'

function FormExport() {
  return (
    <div>
    <HeaderComponent name="Phiếu xuất kho"/>
    {/* <h2>Phiếu xuất kho để tại đây</h2> */}
    <FormExpProduct/>
</div>
  )
}

export default FormExport
