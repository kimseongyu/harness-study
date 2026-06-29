import { http, HttpResponse } from 'msw'

export const handlers = [
  // 1. 이미지 생성 API Mocking
  http.post('/api/image/generate', async ({ request }) => {
    try {
      const body = (await request.json()) as { petType?: string; keyword?: string }
      const { petType, keyword } = body

      if (!petType || !keyword) {
        return HttpResponse.json(
          { success: false, error: { code: 'INVALID_PARAMETER', message: '필수 파라미터가 누락되었습니다.' } },
          { status: 400 }
        )
      }

      // 허용되지 않은 동물 종류 예외 처리
      if (!['cat', 'dog', 'otter', 'rabbit'].includes(petType)) {
        return HttpResponse.json(
          { success: false, error: { code: 'INVALID_PET_TYPE', message: '지원하지 않는 동물 종류입니다.' } },
          { status: 400 }
        )
      }

      return HttpResponse.json({
        success: true,
        data: {
          imageUrl: `https://placehold.co/500x500?text=Mocked+${keyword}+${petType}`,
          petType,
          keyword,
          createdAt: new Date().toISOString()
        }
      })
    } catch {
      return HttpResponse.json(
        { success: false, error: { code: 'BAD_REQUEST', message: '잘못된 형식의 JSON 바디입니다.' } },
        { status: 400 }
      )
    }
  }),

  // 2. 이전 생성 이미지 목록 조회 API Mocking
  http.get('/api/image/history', ({ request }) => {
    const url = new URL(request.url)
    const petType = url.searchParams.get('petType')

    if (!petType) {
      return HttpResponse.json(
        { success: false, error: { code: 'MISSING_QUERY_PARAMETER', message: 'petType 파라미터가 누락되었습니다.' } },
        { status: 400 }
      )
    }

    if (!['cat', 'dog', 'otter', 'rabbit'].includes(petType)) {
      return HttpResponse.json(
        { success: false, error: { code: 'INVALID_PET_TYPE', message: '지원하지 않는 동물 종류입니다.' } },
        { status: 400 }
      )
    }

    // 기본 Mock 히스토리 목록 데이터 반환
    return HttpResponse.json({
      success: true,
      data: {
        petType,
        images: [
          {
            imageUrl: `https://placehold.co/200x200?text=Mocked+cute+${petType}`,
            keyword: 'cute',
            createdAt: new Date().toISOString()
          },
          {
            imageUrl: `https://placehold.co/200x200?text=Mocked+sleepy+${petType}`,
            keyword: 'sleepy',
            createdAt: new Date(Date.now() - 60000).toISOString()
          }
        ]
      }
    })
  })
]
