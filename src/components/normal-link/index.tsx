import React, { useState } from 'react'

interface NormalLinkProps {
  href: string
  children: React.ReactNode
}

const STATUS = {
  HOVERED: 'hovered',
  NORMAL: 'normal',
}

const NormalLink = ({ href, children }: NormalLinkProps) => {
  const [status, setStatus] = useState(STATUS.NORMAL)

  const onMouseEnter = () => {
    setStatus(STATUS.HOVERED)
  }

  const onMouseLeave = () => {
    setStatus(STATUS.NORMAL)
  }

  return (
    <a
      className={status}
      href={href || '#'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {children}
    </a>
  )
}

export default NormalLink
