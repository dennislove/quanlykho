import React from 'react'
import LocationStore from './LocationStore'
import HeaderComponent from '../../components/HeaderComponent/HeaderComponent'

function Locations() {
  return (
    <div>
    <HeaderComponent name="Khu vực lưu trữ"/>
    <LocationStore/>
</div>
  )
}

export default Locations
