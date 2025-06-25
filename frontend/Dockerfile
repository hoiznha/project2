# 1단계: 빌드 스테이지
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


# 2단계: 정적 파일 서빙 스테이지
FROM node:18-alpine

WORKDIR /app

# serve 패키지 글로벌 설치
RUN npm install -g serve

# builder 단계에서 생성된 정적 파일만 복사
COPY --from=builder /app/dist ./dist

EXPOSE 5173

CMD ["serve", "-s", "dist", "-l", "5173"]
