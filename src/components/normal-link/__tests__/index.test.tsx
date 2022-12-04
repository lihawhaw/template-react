import NormalLink from '../index'
import React from 'react'
import renderer from 'react-test-renderer'
import { expect, test } from 'vitest'

function toJson(component: renderer.ReactTestRenderer) {
  const result = component.toJSON()
  expect(result).toBeDefined()
  expect(result).not.toBeInstanceOf(Array)
  return result as renderer.ReactTestRendererJSON
}

test('NormalLink changes the class when hovered', () => {
  const component = renderer.create(
    <NormalLink href='https://lihaha.cn'>李哈哈</NormalLink>,
  )
  let tree = toJson(component)
  expect(tree).toMatchSnapshot()

  // manually trigger the callback
  tree.props.onMouseEnter()

  // re-rendering
  tree = toJson(component)
  expect(tree).toMatchSnapshot()

  // manually trigger the callback
  tree.props.onMouseLeave()
  // re-rendering
  tree = toJson(component)
  expect(tree).toMatchSnapshot()
})
