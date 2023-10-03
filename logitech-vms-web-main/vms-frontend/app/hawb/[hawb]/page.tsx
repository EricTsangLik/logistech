import React from 'react'

const page = ({ params }: { params: { hawb: string } }) => {
  return (
    <div>
      {params.hawb}
    </div>
  )
}

export default page
