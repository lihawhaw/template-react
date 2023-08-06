import loadable from '@loadable/component'
import React from 'react'

interface LazyLoadProps {
  path: string
  fruit?: 'default' | string
  props?: Record<string, any>
}

const lazyLoadComponent = ({ path, props, fruit }: LazyLoadProps) => {
  const Dynamic = loadable(
    (p: LazyLoadProps) =>
      import(/* webpackChunkName: `[request]` */ `../../${p.path}`),
    {
      cacheKey: (p: LazyLoadProps) => p.path,
      resolveComponent: (components, props) =>
        components[props.fruit || 'default'],
    },
  )

  return <Dynamic {...props} path={path} fruit={fruit} />
}

export default lazyLoadComponent
