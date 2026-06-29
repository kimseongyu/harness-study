/**
 * @file HistoryGallery.tsx
 * @description 이전 생성 이미지 파일 목록을 격자 레이아웃으로 렌더링하고 자동 갱신을 지원하는 갤러리 컴포넌트입니다.
 * @requirements REQ-01-F06
 * @api API-02
 * @author Antigravity Agent
 */

'use client'

import React, { useEffect, useState } from 'react'

interface HistoryImage {
  imageUrl: string
  keyword: string
  createdAt: string
}

interface HistoryGalleryProps {
  petType: string
  refreshTrigger: number
}

const PET_NAME_MAP: Record<string, string> = {
  cat: '고양이',
  dog: '강아지',
  otter: '수달',
  rabbit: '토끼'
}

export default function HistoryGallery({ petType, refreshTrigger }: HistoryGalleryProps) {
  const [images, setImages] = useState<HistoryImage[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  const petName = PET_NAME_MAP[petType] || '반려동물'

  useEffect(() => {
    let active = true

    const fetchHistory = async () => {
      setLoading(true)
      const baseUrl = process.env.NODE_ENV === 'test' ? '' : 'http://localhost:3001'
      
      try {
        const response = await fetch(`${baseUrl}/api/image/history?petType=${petType}`)
        const result = await response.json()
        
        if (active && response.ok && result.success) {
          const formattedImages = result.data.images.map((img: HistoryImage) => ({
            ...img,
            imageUrl: img.imageUrl.startsWith('http') ? img.imageUrl : `${baseUrl}${img.imageUrl}`
          }))
          setImages(formattedImages)
        }
      } catch (err) {
        console.error('Failed to fetch history:', err)
      } finally {
        if (active) {
          setLoading(false)
        }
      }
    }

    fetchHistory()

    return () => {
      active = false
    }
  }, [petType, refreshTrigger])

  return (
    <section 
      style={{
        width: '100%',
        maxWidth: '1000px',
        margin: '3rem 0 2rem 0',
        padding: '0 2rem',
        boxSizing: 'border-box'
      }}
    >
      {/* 갤러리 헤더 */}
      <h2 
        style={{
          fontSize: '1.5rem',
          fontWeight: '700',
          marginBottom: '1.5rem',
          color: 'var(--color-text-primary)',
          textAlign: 'left',
          borderLeft: '4px solid var(--color-accent)',
          paddingLeft: '10px'
        }}
      >
        이전에 생성된 {petName} 이미지
      </h2>

      {loading && images.length === 0 ? (
        <div style={{ color: 'var(--color-text-secondary)', padding: '2rem 0' }}>
          갤러리를 불러오는 중입니다...
        </div>
      ) : images.length === 0 ? (
        <div 
          style={{ 
            color: 'var(--color-text-secondary)', 
            padding: '3rem 0',
            textAlign: 'center',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--border-radius-md)',
            background: 'var(--color-bg-glass)'
          }}
        >
          이전에 생성된 이미지가 없습니다.
        </div>
      ) : (
        /* 반응형 격자 갤러리 */
        <div 
          role="feed"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: '20px',
            width: '100%'
          }}
        >
          {images.map((img, idx) => (
            <div
              key={`${img.imageUrl}-${idx}`}
              className="gallery-card"
              style={{
                position: 'relative',
                borderRadius: 'var(--border-radius-md)',
                border: 'var(--glass-border)',
                background: 'var(--color-bg-surface)',
                boxShadow: 'var(--glass-shadow)',
                overflow: 'hidden',
                aspectRatio: '1/1',
                cursor: 'pointer',
                transition: 'var(--transition-smooth)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(6, 182, 212, 0.4), 0 0 10px rgba(6, 182, 212, 0.2)'
                e.currentTarget.style.borderColor = 'var(--color-accent)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)'
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'
              }}
            >
              {/* 이미지 */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={img.imageUrl} 
                alt={`${img.keyword} 스타일 이미지`}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />

              {/* 하단 Glassmorphic 정보 띠 */}
              <div 
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  padding: '8px 12px',
                  background: 'rgba(15, 23, 42, 0.7)',
                  backdropFilter: 'blur(8px)',
                  borderTop: 'var(--glass-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span 
                  style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: '600', 
                    color: 'var(--color-accent)'
                  }}
                >
                  {img.keyword}
                </span>
                <span 
                  style={{ 
                    fontSize: '0.7rem', 
                    color: 'var(--color-text-secondary)'
                  }}
                >
                  {new Date(img.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
