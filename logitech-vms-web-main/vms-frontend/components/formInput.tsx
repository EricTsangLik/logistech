import React from 'react'

const formInput = ({form_label, form_register, form_type}: {form_label: string, form_register: any, form_type: string}) => {
  console.log(typeof form_register);
  console.log(form_register);
  return (
    <div>
        <label className="label">
            <span className='label-text'>{form_label}</span>
        </label>
        {/* <input id={form_label} type={form_type} placeholder={form_placeholder} className="input input-bordered input-primary w-full max-w-xs" /> */}
        <input {...form_register} type={form_type} className="input input-bordered input-primary w-full max-w-xs" />
    </div>
  )
}

export default formInput
