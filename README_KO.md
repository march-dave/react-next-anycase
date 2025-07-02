# 티타늄 도마 사이트

이 저장소에는 Next.js와 OpenAI API로 만든 간단한 ChatGPT 인터페이스가 포함되어 있습니다. 홈 페이지(`/`)에서 바로 사용하거나 `/chatgpt` 경로로 접속할 수 있습니다.

## 로컬 실행 방법

1. 의존성 설치:
   ```bash
   npm install
   ```
2. `OPENAI_API_KEY` 환경 변수를 설정한 후 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```
   또는 다음처럼 한 줄로 실행할 수 있습니다:
   ```bash
   OPENAI_API_KEY=your-key npm run dev
   ```
3. 브라우저에서 `http://localhost:3000` 을 열어 대화를 시작합니다.

추가 페이지:
- `/gpt` : 다른 모델 선택
- `/chatgpt-ui` : 대화 내용이 저장되는 버전
- `/chatgpt-ko` : 한국어 인터페이스

어두운 테마(Dark Mode)와 대화 초기화(Clear) 버튼도 제공합니다.
