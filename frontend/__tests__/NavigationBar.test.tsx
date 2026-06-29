/**
 * @module NavigationBar.test
 * @description NavigationBar 컴포넌트의 탭 렌더링 및 페이지 전환 기능 유닛 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import NavigationBar from '../app/components/NavigationBar'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

// Next.js Navigation Hooks Mocking
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}))

describe('NavigationBar Component', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(usePathname as jest.Mock).mockReturnValue('/')
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams(''))
  })

  test('동물 종류(고양이, 강아지, 수달, 토끼)가 올바르게 표시되는지 확인', () => {
    render(<NavigationBar />)
    expect(screen.getByText('고양이')).toBeInTheDocument()
    expect(screen.getByText('강아지')).toBeInTheDocument()
    expect(screen.getByText('수달')).toBeInTheDocument()
    expect(screen.getByText('토끼')).toBeInTheDocument()
  })

  test('기본 탭(고양이)이 active 상태(aria-current="page")인지 확인', () => {
    render(<NavigationBar />)
    const catTab = screen.getByText('고양이').closest('button') || screen.getByText('고양이')
    expect(catTab).toHaveAttribute('aria-current', 'page')
  })

  test('수달 탭을 클릭하면 URL에 pet=otter 파라미터가 반영되도록 push가 호출되는지 확인', () => {
    render(<NavigationBar />)
    const otterTab = screen.getByText('수달')
    fireEvent.click(otterTab)
    expect(mockPush).toHaveBeenCalledWith('/?pet=otter')
  })
})
