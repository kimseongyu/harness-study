import { setupServer } from 'msw/node'
import { handlers } from './handlers'

// Node (Jest) 환경에서 MSW 모킹을 적용하는 서버 인스턴스를 구축합니다.
export const server = setupServer(...handlers)
