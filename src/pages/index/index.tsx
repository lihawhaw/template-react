import LoadableComponent from '@/components/loadable'
import { request } from '@/utils/request'
import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function IndexPage() {
  const [content, setContent] = React.useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await request.get<{ data: Record<string, string> }>(
          'https://api.vvhan.com/api/reping',
          undefined,
          {
            nonStandardResult: true,
          },
        )
        setContent(response.data.content)
      } catch (error) {
        //
      }
    }
    fetchData()
  }, [])

  return (
    <div>
      IndexPage
      <Link to='/about'>About</Link>
      <LoadableComponent path='components/loadable/example' fruit='Example' />
      <LoadableComponent path='components/loadable/example' />
      <p>{content}</p>
    </div>
  )
}
