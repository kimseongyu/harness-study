/**
 * @file HistoryGallery.test.tsx
 * @description HistoryGallery 컴포넌트의 이력 파일 렌더링 및 동적 로드 통합 테스트
 * @requirements REQ-01-F06
 * @api API-02
 * @author Antigravity Agent
 */

import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import HistoryGallery from '../app/components/HistoryGallery'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

describe('HistoryGallery Component', () => {
  const defaultProps = {
    petType: 'cat',
    refreshTrigger: 0
  }

  test('모킹된 이력 데이터가 존재할 때 격자 그리드 카드들이 올바르게 렌더링되는지 확인', async () => {
    render(<HistoryGallery {...defaultProps} />)

    // 타이틀 확인
    expect(screen.getByText('이전에 생성된 고양이 이미지')).toBeInTheDocument()

    // 카드 목록이 API 응답 후 렌더링되는지 대기
    await waitFor(() => {
      // handlers.ts 에 모킹된 cute, sleepy 2개의 이미지가 렌더링되어야 함
      expect(screen.getByText('cute')).toBeInTheDocument()
      expect(screen.getByText('sleepy')).toBeInTheDocument()
      const images = screen.getAllByRole('img')
      expect(images).toHaveLength(2)
      expect(images[0]).toHaveAttribute('src', expect.stringContaining('cute'))
      expect(images[1]).toHaveAttribute('src', expect.stringContaining('sleepy'))
    })
  })

  test('이력 데이터가 없을 때 비어있음 안내 문구가 표시되는지 확인', async () => {
    // API 빈 배열 응답 모킹 오버라이드
    server.use(
      http.get('/api/image/history', () => {
        return HttpResponse.json({
          success: true,
          data: {
            petType: 'cat',
            images: []
          }
        })
      })
    )

    render(<HistoryGallery {...defaultProps} />)

    await waitFor(() => {
      expect(screen.getByText('이전에 생성된 고양이 이미지')).toBeInTheDocument()
      expect(screen.getByText('이전에 생성된 이미지가 없습니다.')).toBeInTheDocument()
    })
  })
})
