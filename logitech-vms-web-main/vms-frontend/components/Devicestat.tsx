import React from 'react'

const Devicestat = ( {stat_title, stat_value, stat_desc}:{ stat_title: string, stat_value: any, stat_desc: any }) =>  (
  <div className='stat w-auto'>
      <div className='stat-title text-md'>{stat_title}</div>
      <div className='stat-value text-md'>{stat_value}</div>
      <div className='stat-desc'>{stat_desc}</div>
  </div>
)

export default Devicestat