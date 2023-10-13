import React from 'react'
import { useLocation, useOutlet } from 'react-router-dom'
import { SwitchTransition, CSSTransition } from 'react-transition-group'

export default function Layout() {
  const location = useLocation()
  const currentOutlet = useOutlet()

  return (
    <SwitchTransition mode='out-in'>
      <CSSTransition key={location.key} timeout={300} classNames='fade'>
        {currentOutlet}
      </CSSTransition>
    </SwitchTransition>
  )
}
