/**
 * @file ImageGenerator.test.tsx
 * @description ImageGenerator 컴포넌트의 대기, 로딩, 렌더링 상태 유닛 테스트
 */

import React from 'react'
import { render, screen } from '@testing-library/react'
import ImageGenerator from '../app/components/ImageGenerator'

describe('ImageGenerator Component', () => {
  const defaultProps = {
    imageUrl: null,
    isLoading: false,
    petType: 'cat',
    onDownload: jest.fn(),
    onRegenerate: jest.fn(),
  }

  test('초기 대기 상태일 때 안내 문구가 올바르게 나타나는지 확인', () => {
    render(<ImageGenerator {...defaultProps} />)
    expect(screen.getByText(/동물 이미지를 생성하기 위해 아래 키워드 버튼을 누르세요/i)).toBeInTheDocument()
  })

  test('로딩 상태일 때 aria-busy="true" 속성이 뷰어에 적용되는지 확인', () => {
    const { container } = render(<ImageGenerator {...defaultProps} isLoading={true} />)
    const viewer = container.querySelector('[aria-busy="true"]')
    expect(viewer).toBeInTheDocument()
  })

  test('이미지 URL이 존재할 때 이미지가 올바르게 렌더링되는지 확인', () => {
    const testUrl = 'https://example.com/test_cat.jpg'
    render(<ImageGenerator {...defaultProps} imageUrl={testUrl} />)
    const img = screen.getByRole('img') as HTMLImageElement
    expect(img).toBeInTheDocument()
    expect(img.src).toBe(testUrl)
    expect(img.alt).toBe('귀여운 고양이 이미지')
  })

  test('다운로드 및 새로고침 버튼이 UI에 노출되는지 확인', () => {
    render(<ImageGenerator {...defaultProps} />)
    expect(screen.getByRole('button', { name: /download/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /regenerate/i })).toBeInTheDocument()
  })
})
