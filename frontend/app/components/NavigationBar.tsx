/**
 * @file NavigationBar.tsx
 * @description 상단 네비게이션 바 컴포넌트로 동물 선택 탭과 라우팅을 관리합니다.
 * @requirements REQ-01-F01
 * @api N/A
 * @author Antigravity Agent
 */

'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

interface PetTab {
  key: string
  label: string
}

const PET_TABS: PetTab[] = [
  { key: 'cat', label: '고양이' },
  { key: 'dog', label: '강아지' },
  { key: 'otter', label: '수달' },
  { key: 'rabbit', label: '토끼' }
]

export default function NavigationBar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // 현재 선택된 동물 종류 (기본값: 'cat')
  const currentPet = searchParams.get('pet') || 'cat'

  const handleTabClick = (petKey: string) => {
    router.push(`/?pet=${petKey}`)
  }

  return (
    <header 
      style={{
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: 'var(--color-bg-glass)',
        backdropFilter: 'var(--glass-blur)',
        borderBottom: 'var(--glass-border)',
        boxShadow: 'var(--glass-shadow)',
        boxSizing: 'border-box'
      }}
    >
      {/* 로고 영역 */}
      <div 
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          color: 'var(--color-accent)',
          cursor: 'pointer'
        }}
        onClick={() => router.push('/')}
      >
        PET AI GENERATOR
      </div>

      {/* 내비게이션 메뉴 */}
      <nav>
        <ul style={{ display: 'flex', gap: '2rem', listStyle: 'none', margin: 0, padding: 0 }}>
          {PET_TABS.map((tab) => {
            const isActive = currentPet === tab.key
            return (
              <li key={tab.key}>
                <button
                  onClick={() => handleTabClick(tab.key)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    background: 'none',
                    border: 'none',
                    borderBottom: isActive ? '2px solid var(--color-accent)' : '2px solid transparent',
                    color: isActive ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    fontWeight: isActive ? 'bold' : 'normal',
                    fontSize: '1rem',
                    padding: '0.5rem 0',
                    cursor: 'pointer',
                    outline: 'none',
                    transition: 'var(--transition-smooth)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-primary)'
                      e.currentTarget.style.borderBottom = '2px solid var(--color-primary)'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = 'var(--color-text-secondary)'
                      e.currentTarget.style.borderBottom = '2px solid transparent'
                    }
                  }}
                >
                  {tab.label}
                </button>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
