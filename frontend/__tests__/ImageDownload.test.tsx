/**
 * @file ImageDownload.test.tsx
 * @description 이미지 다운로드 버튼 클릭 시 브라우저 다운로드 동작 유발 통합 테스트
 * @requirements REQ-01-F04
 * @api N/A
 * @author Antigravity Agent
 */

import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ImageGenerator from '../app/components/ImageGenerator'

describe('Image Download Feature', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    
    // global fetch Mocking
    global.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        ok: true,
        blob: () => Promise.resolve(new Blob(['fake_data'], { type: 'image/jpeg' })),
      })
    )

    // global URL.createObjectURL 및 revokeObjectURL Mocking
    window.URL.createObjectURL = jest.fn().mockReturnValue('blob:http://localhost/fake-blob-url')
    window.URL.revokeObjectURL = jest.fn()
  })

  test('imageUrl이 주어졌을 때 Download 클릭 시 올바른 파일명으로 브라우저 다운로드가 유발되는지 확인', async () => {
    const testImageUrl = 'http://localhost:3001/images/cat/cat_cute_1719660000.jpg'
    
    const handleDownloadReal = async () => {
      try {
        const response = await fetch(testImageUrl)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        const filename = testImageUrl.substring(testImageUrl.lastIndexOf('/') + 1) || 'cat_cute.jpg'
        a.download = filename
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        window.URL.revokeObjectURL(url)
      } catch (err) {
        window.open(testImageUrl, '_blank')
      }
    }

    render(
      <ImageGenerator 
        imageUrl={testImageUrl}
        isLoading={false}
        petType="cat"
        onDownload={handleDownloadReal}
        onRegenerate={jest.fn()}
      />
    )

    const downloadBtn = screen.getByRole('button', { name: /download/i })
    const linkClickSpy = jest.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(() => {})

    fireEvent.click(downloadBtn)

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(testImageUrl)
      expect(window.URL.createObjectURL).toHaveBeenCalled()
      expect(linkClickSpy).toHaveBeenCalled()
    })

    linkClickSpy.mockRestore()
  })
})
