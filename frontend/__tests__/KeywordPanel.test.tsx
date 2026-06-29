/**
 * @file KeywordPanel.test.tsx
 * @description KeywordPanel 컴포넌트의 10개 키워드 렌더링 및 비활성화 기능 테스트
 */

import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import KeywordPanel from '../app/components/KeywordPanel'

describe('KeywordPanel Component', () => {
  const defaultProps = {
    isLoading: false,
    onKeywordClick: jest.fn(),
  }

  test('10개의 키워드 버튼이 올바르게 렌더링되는지 확인', () => {
    render(<KeywordPanel {...defaultProps} />)
    const expectedKeywords = [
      '귀여운', '하찮은', '용감한', '우아한', '졸린', 
      '행복한', '신비로운', '뚱한', '장난꾸러기', '터프한'
    ]
    expectedKeywords.forEach((kw) => {
      expect(screen.getByRole('button', { name: kw })).toBeInTheDocument()
    })
  })

  test('키워드 클릭 시 영문 키워드 매핑 값이 콜백으로 호출되는지 확인', () => {
    const onKeywordClickMock = jest.fn()
    render(<KeywordPanel {...defaultProps} onKeywordClick={onKeywordClickMock} />)
    
    // '귀여운' 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: '귀여운' }))
    expect(onKeywordClickMock).toHaveBeenCalledWith('cute')

    // '하찮은' 버튼 클릭
    fireEvent.click(screen.getByRole('button', { name: '하찮은' }))
    expect(onKeywordClickMock).toHaveBeenCalledWith('dumb')
  })

  test('로딩 중일 때 모든 버튼이 비활성화(disabled)되는지 확인', () => {
    render(<KeywordPanel {...defaultProps} isLoading={true} />)
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(10)
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled()
    })
  })
})
