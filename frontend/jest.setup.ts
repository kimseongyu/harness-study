import '@testing-library/jest-dom'
import { beforeAll, afterEach, afterAll } from '@jest/globals'
import { server } from './mocks/server'


// 모든 Jest 테스트 시작 전 MSW 모킹 서버 기동
beforeAll(() => server.listen())

// 테스트 간 오염 방지를 위해 매 테스트 종료 후 핸들러 상태 리셋
afterEach(() => server.resetHandlers())

// 모든 테스트 완료 후 서버 종료
afterAll(() => server.close())

