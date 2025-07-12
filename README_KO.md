# 티타늄 도마 사이트

이 저장소에는 Next.js와 OpenAI API로 만든 간단한 ChatGPT 인터페이스가 포함되어 있습니다. 홈 페이지(`/`)에서 바로 사용하거나 `/chatgpt` 경로로 접속할 수 있습니다.

## 로컬 실행 방법

1. 의존성 설치:
   ```bash
   npm install
   ```
2. `.env.example` 파일을 `.env.local`로 복사한 뒤 `OPENAI_API_KEY`를 입력합니다.
   기본 모델을 변경하려면 `OPENAI_MODEL`도 지정한 후 개발 서버를 실행합니다:
   ```bash
   npm run dev
   ```
   또는 다음처럼 한 줄로 실행할 수 있습니다:
   ```bash
   OPENAI_API_KEY=your-key OPENAI_MODEL=gpt-4 npm run dev
   ```
3. 브라우저에서 `http://localhost:3000` 을 열어 대화를 시작합니다.

추가 페이지:
- `/chatgpt` : 홈 페이지와 동일한 인터페이스
- `/gpt` : 다른 모델 선택
- `/chatgpt-ui` : 대화 내용이 저장되는 버전
- `/chatgpt-ko` : 한국어 인터페이스

모든 채팅 페이지에서 다크 모드 전환과 대화 초기화(Clear) 버튼을 사용할 수 있습니다.
이제 대화 내용을 클립보드에 복사하는 **내보내기** 버튼도 제공합니다.

더 자세한 내용은 [README.md](./README.md)와 간단한 사용법을 정리한
[CHATGPT_UI.md](./CHATGPT_UI.md)를 참고하세요.
