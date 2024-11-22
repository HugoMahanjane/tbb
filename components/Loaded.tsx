import Image from 'next/image'
import React from 'react'

const Loaded = () => {
  return (
    <div className='flex-center h-screen w-full'>
        <Image
            src="/icons/loading-circle.svg"
            alt="load image"
            width={50}
            height={50}
        />
    </div>
  )
}

export default Loaded