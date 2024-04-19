import React from 'react'
import SideNav from 'components/side-nav/SideNav'
import TopNav from 'components/top-nav/TopNav'
import AppRoutes from 'routes'

function App() {
  return (
    <div className="">
      <div className="w-screen flex flex-row">
        <SideNav />
        <div className="w-full">
          <TopNav />
          <div className="overflow-y-scroll h-[calc(100vh-3.5rem)] p-6 bg-slate-50">
            <AppRoutes />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
