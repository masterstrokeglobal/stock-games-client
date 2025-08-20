import React from 'react'

const LoaderAviator = () => {
  return (
    <div className="absolute inset-0">
      <div className='w-full h-full bg-[url("/images/aviator/hanger.webp")] bg-cover bg-center'></div>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url("/videos/aviator/dance.gif")] bg-cover bg-center'></div>
    </div>
  )
}

export default LoaderAviator 