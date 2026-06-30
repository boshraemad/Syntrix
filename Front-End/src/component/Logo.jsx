import React from 'react'

import { Link } from 'react-router-dom'
import logoImg from '../assets/logo.jpg'

export default function Logo() {
  return (
    <Link to="/" className="hover:opacity-80 transition-opacity">
      <img src={logoImg} alt="Syntrix" className="h-24 object-contain" />
    </Link>
  )
}
