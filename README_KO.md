# 티타늄 도마 사이트

이 저장소에는 Next.js와 OpenAI API로 만든 ChatGPT 인터페이스가 포함되어 있습니다. 이제 홈 페이지(`/`)는 대화 내용이 저장되는 ChatGPT UI를 사용하며, 간단한 비지속형 인터페이스는 `/chatgpt` 경로로 접속할 수 있습니다.

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
- `/chatgpt` : 간단한 비지속형 인터페이스
- `/gpt` : 다른 모델 선택
- `/chatgpt-ui` : 대화 내용이 저장되는 기본 홈 페이지 인터페이스
- `/chatgpt-ui-stream` : 스트리밍 응답과 저장 기능을 함께 제공
- `/chatgpt-ko` : 한국어 인터페이스

모든 채팅 페이지에서 다크 모드 전환과 대화 초기화(Clear) 버튼을 사용할 수 있습니다. 초기화 버튼을 누르면 대화를 지우기 전에 한 번 더 확인합니다.
이제 대화 내용을 클립보드에 복사하는 **내보내기** 버튼도 제공합니다.
대화 내용을 파일로 저장하는 **다운로드** 버튼도 추가되었습니다.
각 메시지 옆에 있는 작은 **복사** 버튼을 눌러 원하는 문장을 바로 복사할 수 있습니다.
입력한 메시지가 없거나 응답을 기다리는 동안에는 전송 버튼이 비활성화됩니다.

더 자세한 내용은 [README.md](./README.md)와 간단한 사용법을 정리한
[CHATGPT_UI.md](./CHATGPT_UI.md)를 참고하세요.
