/**
 * @file KeywordPanel.tsx
 * @description 이미지 생성 스타일 선택을 위한 10개 키워드 버튼 그리드 패널 컴포넌트입니다.
 * @requirements REQ-01-F03
 * @api N/A
 * @author Antigravity Agent
 */

'use client'

import React from 'react'

interface Keyword {
  ko: string
  en: string
}

const KEYWORDS: Keyword[] = [
  { ko: '귀여운', en: 'cute' },
  { ko: '하찮은', en: 'dumb' },
  { ko: '용감한', en: 'brave' },
  { ko: '우아한', en: 'elegant' },
  { ko: '졸린', en: 'sleepy' },
  { ko: '행복한', en: 'happy' },
  { ko: '신비로운', en: 'mysterious' },
  { ko: '뚱한', en: 'sulky' },
  { ko: '장난꾸러기', en: 'playful' },
  { ko: '터프한', en: 'tough' }
]

interface KeywordPanelProps {
  isLoading: boolean
  onKeywordClick: (keywordEn: string) => void
}

export default function KeywordPanel({ isLoading, onKeywordClick }: KeywordPanelProps) {
  return (
    <div 
      style={{
        width: '100%',
        maxWidth: '800px',
        margin: '1.5rem 0',
        padding: '0 1rem',
        boxSizing: 'border-box'
      }}
    >
      <div 
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '15px',
          width: '100%'
        }}
        className="keyword-grid"
      >
        {KEYWORDS.map((kw) => (
          <button
            key={kw.en}
            id={`btn-keyword-${kw.en}`}
            disabled={isLoading}
            onClick={() => onKeywordClick(kw.en)}
            style={{
              padding: '14px 10px',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.95rem',
              fontWeight: '500',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              background: 'var(--color-bg-surface)',
              border: 'var(--glass-border)',
              color: 'var(--color-text-primary)',
              opacity: isLoading ? 0.4 : 1,
              transition: 'var(--transition-smooth)',
              outline: 'none',
              boxSizing: 'border-box',
              textAlign: 'center',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'linear-gradient(135deg, var(--color-primary), var(--color-accent))'
                e.currentTarget.style.transform = 'scale(1.05)'
                e.currentTarget.style.boxShadow = 'var(--glass-shadow)'
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.currentTarget.style.background = 'var(--color-bg-surface)'
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = 'none'
              }
            }}
          >
            {kw.ko}
          </button>
        ))}
      </div>

      {/* 미디어 쿼리를 사용한 반응형 가변 변환 스타일 주입 */}
      <style>{`
        @media (max-width: 1023px) {
          .keyword-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 767px) {
          .keyword-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </div>
  )
}
