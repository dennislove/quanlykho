import React from 'react'
import Dashboard from './Dashboard'

function DefautComponent({children}) {


  return (
  
    <div className=' flex min-h-screen bg-gray-50'>
    <Dashboard/>
    <div className='p-4 ml-80 w-full'>
        <div className=''> {children}</div>
    </div>
</div>
  )
}

export default DefautComponent
