import React from 'react'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'
import SessionViewer from './SessionViewer'

function CmdImport() {
  return (
    <div>
    <HeaderComponent name="Lệnh nhập hàng"/>
    {/* <h2>Lệnh nhập kho để tại đây.</h2> */}
    <SessionViewer/>
</div>
  )
}

export default CmdImport
