import React from "react"

const Page = ({ children, title = ''} : {children: React.ReactNode, title: string}) => {
  return (
    <>
      <title>{title}</title>
      <div className='flex flex-col m-2'>
        {children}
      </div>
    </>
  )
}

export default Page