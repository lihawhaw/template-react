import LoadableComponent from '@/components/loadable'
import React from 'react'
import { Link } from 'react-router-dom'

export default function IndexPage() {
  return (
    <div>
      IndexPage
      <Link to='/about'>About</Link>
      <LoadableComponent path='components/loadable/example' fruit='Example' />
      <LoadableComponent path='components/loadable/example' />
    </div>
  )
}
