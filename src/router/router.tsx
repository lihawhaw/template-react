import React from 'react'
import { Routes, Route, BrowserRouter } from 'react-router-dom'
import loadable from '@loadable/component'
import Layout from '@/layout'

const Home = loadable(() => import('@/pages/home'))
const About = loadable(() => import('@/pages/about'))
const NoMatch = loadable(() => import('@/components/no-match'))

export default function AppRouter() {
  return (
    <BrowserRouter basename='/tamplate-react'>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='about' element={<About />} />

          <Route path='*' element={<NoMatch />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
