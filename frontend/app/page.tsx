/**
 * @file page.tsx
 * @description 반려동물 AI 이미지 생성 서비스의 메인 엔트리 페이지입니다.
 * @requirements REQ-01-F01, REQ-01-F02, REQ-01-F03, REQ-01-F04, REQ-01-F06
 * @api API-01, API-02
 * @author Antigravity Agent
 */

'use client'

import React, { Suspense, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import NavigationBar from './components/NavigationBar'
import ImageGenerator from './components/ImageGenerator'
import KeywordPanel from './components/KeywordPanel'
import HistoryGallery from './components/HistoryGallery'

function MainContent() {
  const searchParams = useSearchParams()
  const currentPet = searchParams.get('pet') || 'cat'

  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [lastKeyword, setLastKeyword] = useState<string | null>(null)
  
  // 새로운 이미지 생성 성공 시 하단 갤러리를 자동 갱신시키기 위한 트리거 상태
  const [refreshTrigger, setRefreshTrigger] = useState<number>(0)

  const handleKeywordClick = async (keywordEn: string) => {
    setIsLoading(true)
    setLastKeyword(keywordEn)

    const baseUrl = process.env.NODE_ENV === 'test' ? '' : 'http://localhost:3001'

    try {
      const response = await fetch(`${baseUrl}/api/image/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          petType: currentPet,
          keyword: keywordEn
        })
      })

      const result = await response.json()

      if (response.ok && result.success) {
        const fullUrl = result.data.imageUrl.startsWith('http')
          ? result.data.imageUrl
          : `${baseUrl}${result.data.imageUrl}`
        setImageUrl(fullUrl)
        
        // 이미지 생성 성공 시 갤러리 갱신 트리거 작동
        setRefreshTrigger((prev) => prev + 1)
      } else {
        const errorMsg = result.error?.message || '알 수 없는 오류가 발생했습니다.'
        alert(`이미지 생성 중 오류가 발생했습니다: ${errorMsg}`)
      }
    } catch (err: any) {
      alert(`이미지 생성 중 오류가 발생했습니다: Network Error (${err.message})`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!imageUrl) return
    try {
      const response = await fetch(imageUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      
      const cleanPath = imageUrl.split('?')[0]
      const filename = cleanPath.substring(cleanPath.lastIndexOf('/') + 1) || `${currentPet}_image.jpg`
      
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    } catch (err: any) {
      console.error('Download failed, falling back to window.open', err)
      window.open(imageUrl, '_blank')
    }
  }

  const handleRegenerate = () => {
    if (lastKeyword) {
      handleKeywordClick(lastKeyword)
    }
  }

  return (
    <main 
      style={{
        paddingTop: '90px',
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxSizing: 'border-box'
      }}
    >
      <NavigationBar />
      
      {/* 이미지 뷰어 영역 */}
      <ImageGenerator 
        imageUrl={imageUrl}
        isLoading={isLoading}
        petType={currentPet}
        onDownload={handleDownload}
        onRegenerate={handleRegenerate}
      />

      {/* 키워드 패널 영역 */}
      <KeywordPanel 
        isLoading={isLoading}
        onKeywordClick={handleKeywordClick}
      />

      {/* 히스토리 갤러리 영역 */}
      <HistoryGallery 
        petType={currentPet}
        refreshTrigger={refreshTrigger}
      />
    </main>
  )
}

export default function Home() {
  return (
    <Suspense fallback={<div className="text-white p-4">Loading...</div>}>
      <MainContent />
    </Suspense>
  )
}
