import React, { Suspense } from 'react'

const Layout = ({ children }) => {
  return (
    <div>
        <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
    </div>
  )
}

export default Layout