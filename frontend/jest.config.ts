import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({
  // Next.js 앱 경로를 지정하여 next.config.js 및 .env 파일을 로드하도록 함
  dir: './',
})

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    // 절대 경로 mapping 설정 지원 (Next.js tsconfig 에 맞춤)
    '^@/(.*)$': '<rootDir>/$1',
  },
}

export default createJestConfig(config)
