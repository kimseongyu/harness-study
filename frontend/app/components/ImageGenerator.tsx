/**
 * @file ImageGenerator.tsx
 * @description 이미지 뷰어 영역 및 다운로드/재요청 제어 콘솔 컴포넌트입니다.
 * @requirements REQ-01-F02, REQ-01-F04
 * @api N/A
 * @author Antigravity Agent
 */

'use client'

import React from 'react'

interface ImageGeneratorProps {
  imageUrl: string | null
  isLoading: boolean
  petType: string
  onDownload: () => void
  onRegenerate: () => void
}

const PET_NAME_MAP: Record<string, string> = {
  cat: '고양이',
  dog: '강아지',
  otter: '수달',
  rabbit: '토끼'
}

export default function ImageGenerator({
  imageUrl,
  isLoading,
  petType,
  onDownload,
  onRegenerate
}: ImageGeneratorProps) {
  const petName = PET_NAME_MAP[petType] || '반려동물'

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1.5rem',
        margin: '2rem 0',
        width: '100%',
        maxWidth: '500px'
      }}
    >
      {/* 500px x 500px 정방형 이미지 뷰어 */}
      <div 
        aria-busy={isLoading ? 'true' : 'false'}
        style={{
          width: '500px',
          height: '500px',
          position: 'relative',
          borderRadius: 'var(--border-radius-lg)',
          border: 'var(--glass-border)',
          background: 'var(--color-bg-glass)',
          boxShadow: 'var(--glass-shadow)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          transition: 'var(--transition-smooth)'
        }}
      >
        {isLoading ? (
          /* 로딩 오버레이 */
          <div 
            style={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'rgba(15, 23, 42, 0.6)',
              backdropFilter: 'var(--glass-blur)',
              gap: '1rem',
              color: 'var(--color-text-primary)'
            }}
          >
            {/* 펄싱 스피너 */}
            <div 
              style={{
                width: '50px',
                height: '50px',
                border: '4px solid var(--color-bg-surface)',
                borderTop: '4px solid var(--color-accent)',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}
            />
            <span>이미지를 생성하는 중입니다...</span>
          </div>
        ) : imageUrl ? (
          /* 생성 완료 이미지 */
          // eslint-disable-next-line @next/next/no-img-element
          <img 
            src={imageUrl} 
            alt={`귀여운 ${petName} 이미지`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }}
          />
        ) : (
          /* 초기 대기 상태 */
          <div 
            style={{
              textAlign: 'center',
              padding: '2rem',
              color: 'var(--color-text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1rem'
            }}
          >
            {/* 동물 실루엣을 표현한 임의의 SVG 아이콘 */}
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5Z" />
              <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" />
            </svg>
            <p style={{ margin: 0, fontSize: '0.95rem' }}>
              동물 이미지를 생성하기 위해 아래 키워드 버튼을 누르세요
            </p>
          </div>
        )}
      </div>

      {/* 다운로드 & 새로고침 버튼 */}
      <div 
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          width: '100%',
          gap: '1rem'
        }}
      >
        <button
          onClick={onDownload}
          disabled={!imageUrl || isLoading}
          style={{
            flex: 1,
            padding: '12px 24px',
            borderRadius: 'var(--border-radius-sm)',
            border: 'var(--glass-border)',
            background: 'var(--color-bg-glass)',
            color: imageUrl && !isLoading ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            fontWeight: '600',
            cursor: imageUrl && !isLoading ? 'pointer' : 'not-allowed',
            opacity: imageUrl && !isLoading ? 1 : 0.5,
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => {
            if (imageUrl && !isLoading) {
              e.currentTarget.style.background = 'var(--color-primary)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (imageUrl && !isLoading) {
              e.currentTarget.style.background = 'var(--color-bg-glass)'
              e.currentTarget.style.transform = 'none'
            }
          }}
        >
          Download
        </button>
        <button
          onClick={onRegenerate}
          disabled={!imageUrl || isLoading}
          style={{
            flex: 1,
            padding: '12px 24px',
            borderRadius: 'var(--border-radius-sm)',
            border: 'var(--glass-border)',
            background: 'var(--color-bg-glass)',
            color: imageUrl && !isLoading ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
            fontWeight: '600',
            cursor: imageUrl && !isLoading ? 'pointer' : 'not-allowed',
            opacity: imageUrl && !isLoading ? 1 : 0.5,
            transition: 'var(--transition-smooth)'
          }}
          onMouseEnter={(e) => {
            if (imageUrl && !isLoading) {
              e.currentTarget.style.background = 'var(--color-primary)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }
          }}
          onMouseLeave={(e) => {
            if (imageUrl && !isLoading) {
              e.currentTarget.style.background = 'var(--color-bg-glass)'
              e.currentTarget.style.transform = 'none'
            }
          }}
        >
          Regenerate
        </button>
      </div>

      {/* 스피너 애니메이션용 style 정의 */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
