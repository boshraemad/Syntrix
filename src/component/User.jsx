import React from 'react'

export default function User() {
  const firstNameL=JSON.parse(localStorage.getItem("user-data")).firstName[0];
  const lastNameL=JSON.parse(localStorage.getItem("user-data")).lastName[0];

  return (
    <div className='w-7.5 h-7.5 rounded-full bg-pink-400 text-font flex items-center justify-center'>{firstNameL + lastNameL}</div>
  )
}
