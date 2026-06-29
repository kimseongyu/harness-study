/**
 * @file ImageGenerationIntegration.test.tsx
 * @description 키워드 버튼 클릭 및 새로고침 액션에 따른 API 연동(MSW) 통합 테스트
 * @requirements REQ-01-F03, REQ-01-F04
 * @api API-01
 * @author Antigravity Agent
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import Home from '../app/page'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { server } from '../mocks/server'
import { http, HttpResponse } from 'msw'

// Next.js Navigation Hooks Mocking
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}))

describe('Image Generation Integration Test', () => {
  const mockPush = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    })
    ;(usePathname as jest.Mock).mockReturnValue('/')
    ;(useSearchParams as jest.Mock).mockReturnValue(new URLSearchParams('pet=cat'))
  })

  test('키워드 버튼(귀여운) 클릭 시 로딩을 거쳐 모킹된 이미지가 뷰어에 렌더링되는지 확인', async () => {
    render(<Home />)
    
    // 초기 대기 상태 텍스트 확인
    expect(screen.getByText(/동물 이미지를 생성하기 위해 아래 키워드 버튼을 누르세요/i)).toBeInTheDocument()

    // '귀여운' 버튼 클릭
    const cuteBtn = screen.getByRole('button', { name: '귀여운' })
    fireEvent.click(cuteBtn)

    // 로딩 문구가 나타나는지 확인
    expect(screen.getByText(/이미지를 생성하는 중입니다/i)).toBeInTheDocument()

    // API 완료 후 이미지가 로드되는지 대기 및 확인
    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement
      expect(img).toBeInTheDocument()
      expect(img.src).toContain('Mocked+cute+cat')
      expect(img.alt).toBe('귀여운 고양이 이미지')
    })
  })

  test('새로고침(Regenerate) 버튼 클릭 시 직전 키워드로 이미지가 재생성되는지 확인', async () => {
    render(<Home />)
    
    // 1단계: 귀여운 이미지 생성 유도
    fireEvent.click(screen.getByRole('button', { name: '귀여운' }))
    await waitFor(() => {
      expect(screen.getByRole('img')).toBeInTheDocument()
    })

    // 2단계: 새로고침 버튼 클릭
    const regenBtn = screen.getByRole('button', { name: /regenerate/i })
    fireEvent.click(regenBtn)

    // 로딩 문구가 다시 표시되는지 확인
    expect(screen.getByText(/이미지를 생성하는 중입니다/i)).toBeInTheDocument()

    // 재생성 완료 대기
    await waitFor(() => {
      const img = screen.getByRole('img') as HTMLImageElement
      expect(img.src).toContain('Mocked+cute+cat')
    })
  })

  test('API 호출 실패 시 로딩이 해제되고 비정상 응답에 대해 알람이나 안전한 UI 상태 유지가 되는지 확인', async () => {
    // API 에러 모킹 오버라이드
    server.use(
      http.post('/api/image/generate', () => {
        return HttpResponse.json(
          { success: false, error: { code: 'SERVER_ERROR', message: '오류가 발생했습니다.' } },
          { status: 500 }
        )
      })
    )

    // alert 모킹
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {})

    render(<Home />)
    
    // 키워드 클릭
    fireEvent.click(screen.getByRole('button', { name: '귀여운' }))

    // 에러 발생 및 로딩이 풀리는지 대기
    await waitFor(() => {
      expect(screen.queryByText(/이미지를 생성하는 중입니다/i)).not.toBeInTheDocument()
      expect(alertMock).toHaveBeenCalledWith(expect.stringContaining('이미지 생성 중 오류가 발생했습니다'))
    })

    alertMock.mockRestore()
  })
})
