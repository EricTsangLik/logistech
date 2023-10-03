import React from 'react'

const Orderstat = ( {stat_title, stat_value, stat_desc, stat_actions}:{ stat_title: string, stat_value: any, stat_desc: any, stat_actions: any }) =>  (
  <div className='stat h-auto'>
      <div className='stat-title text-md'>{stat_title}</div>
      <div className='stat-value text-md'>{stat_value}</div>
      <div className='stat-desc'>{stat_desc}</div>
      <div className='stat-actions'> {stat_actions}</div>
  </div>
)

export default Orderstat