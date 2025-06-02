# ??? (보안)

> <br/>
>  ??? 기업과제 입니다.(보안상 기입하지 않았습니다). <br/>
> <br>

PM 또는 요구사항을 처음 접하는 분들도 <strong>이해하기 쉽게 작성</strong>되었으며 이해를 돕기 위해 내용이 중복되더라도 <strong>상세하고 구체적으로 작성</strong>하였습니다. <br>

</p>
</div>
  </a>

## 구성

<!-- toc -->

- [설치방법 및 실행방법](#%EC%84%A4%EC%B9%98%EB%B0%A9%EB%B2%95-%EB%B0%8F-%EC%8B%A4%ED%96%89%EB%B0%A9%EB%B2%95)
- [프로젝트 구조 및 설계 개요](#%ED%94%84%EB%A1%9C%EC%A0%9D%ED%8A%B8-%EA%B5%AC%EC%A1%B0-%EB%B0%8F-%EC%84%A4%EA%B3%84-%EA%B0%9C%EC%9A%94)
  - [1. MSA 아키텍처와 모노레포 구성](#1-msa-%EC%95%84%ED%82%A4%ED%85%8D%EC%B2%98%EC%99%80-%EB%AA%A8%EB%85%B8%EB%A0%88%ED%8F%AC-%EA%B5%AC%EC%84%B1)
  - [2. 도메인 단위의 구조 분리 (DDD 스타일 일부 적용)](#2-%EB%8F%84%EB%A9%94%EC%9D%B8-%EB%8B%A8%EC%9C%84%EC%9D%98-%EA%B5%AC%EC%A1%B0-%EB%B6%84%EB%A6%AC-ddd-%EC%8A%A4%ED%83%80%EC%9D%BC-%EC%9D%BC%EB%B6%80-%EC%A0%81%EC%9A%A9)
  - [3. 공통 유틸리티 및 설정 파일 분리](#3-%EA%B3%B5%ED%86%B5-%EC%9C%A0%ED%8B%B8%EB%A6%AC%ED%8B%B0-%EB%B0%8F-%EC%84%A4%EC%A0%95-%ED%8C%8C%EC%9D%BC-%EB%B6%84%EB%A6%AC)
  - [4. Docker 기반의 로컬 개발 환경(요구 사항)](#4-docker-%EA%B8%B0%EB%B0%98%EC%9D%98-%EB%A1%9C%EC%BB%AC-%EA%B0%9C%EB%B0%9C-%ED%99%98%EA%B2%BD%EC%9A%94%EA%B5%AC-%EC%82%AC%ED%95%AD)
  - [5. 환경 변수와 설정 관리 전략](#5-%ED%99%98%EA%B2%BD-%EB%B3%80%EC%88%98%EC%99%80-%EC%84%A4%EC%A0%95-%EA%B4%80%EB%A6%AC-%EC%A0%84%EB%9E%B5)
  - [6. 확장성과 운영 고려 사항](#6-%ED%99%95%EC%9E%A5%EC%84%B1%EA%B3%BC-%EC%9A%B4%EC%98%81-%EA%B3%A0%EB%A0%A4-%EC%82%AC%ED%95%AD)
- [서비스별 구성 및 역할](#%EC%84%9C%EB%B9%84%EC%8A%A4%EB%B3%84-%EA%B5%AC%EC%84%B1-%EB%B0%8F-%EC%97%AD%ED%95%A0)
  - [Auth 서비스](#auth-%EC%84%9C%EB%B9%84%EC%8A%A4)
  - [Event 서비스](#event-%EC%84%9C%EB%B9%84%EC%8A%A4)
  - [Gateway 서비스](#gateway-%EC%84%9C%EB%B9%84%EC%8A%A4)
  - [공통 모듈 (`libs/`)](#%EA%B3%B5%ED%86%B5-%EB%AA%A8%EB%93%88-libs)
- [데이터베이스 모델(ERD)](#%EB%8D%B0%EC%9D%B4%ED%84%B0%EB%B2%A0%EC%9D%B4%EC%8A%A4-%EB%AA%A8%EB%8D%B8erd)
  - [User](#user)
  - [Referral](#referral)
  - [UserLogin](#userlogin)
  - [Event](#event)
  - [Reward](#reward)
  - [Claim](#claim)
- [API 명세서](#api-%EB%AA%85%EC%84%B8%EC%84%9C)
  - [회원가입 API](#%ED%9A%8C%EC%9B%90%EA%B0%80%EC%9E%85-api)
  - [로그인 API](#%EB%A1%9C%EA%B7%B8%EC%9D%B8-api)
  - [내 정보 조회 API](#%EB%82%B4-%EC%A0%95%EB%B3%B4-%EC%A1%B0%ED%9A%8C-api)
  - [프로필 수정 API](#%ED%94%84%EB%A1%9C%ED%95%84-%EC%88%98%EC%A0%95-api)
  - [추천 코드 조회 API](#%EC%B6%94%EC%B2%9C-%EC%BD%94%EB%93%9C-%EC%A1%B0%ED%9A%8C-api)
  - [유저 권한 변경 API](#%EC%9C%A0%EC%A0%80-%EA%B6%8C%ED%95%9C-%EB%B3%80%EA%B2%BD-api)
  - [보상 요청 API](#%EB%B3%B4%EC%83%81-%EC%9A%94%EC%B2%AD-api)
  - [내 보상 이력 조회 API](#%EB%82%B4-%EB%B3%B4%EC%83%81-%EC%9D%B4%EB%A0%A5-%EC%A1%B0%ED%9A%8C-api)
  - [전체 보상 이력 조회 API](#%EC%A0%84%EC%B2%B4-%EB%B3%B4%EC%83%81-%EC%9D%B4%EB%A0%A5-%EC%A1%B0%ED%9A%8C-api)
  - [특정 유저 보상 이력 조회 API](#%ED%8A%B9%EC%A0%95-%EC%9C%A0%EC%A0%80-%EB%B3%B4%EC%83%81-%EC%9D%B4%EB%A0%A5-%EC%A1%B0%ED%9A%8C-api)
  - [필터링된 보상 이력 조회 API](#%ED%95%84%ED%84%B0%EB%A7%81%EB%90%9C-%EB%B3%B4%EC%83%81-%EC%9D%B4%EB%A0%A5-%EC%A1%B0%ED%9A%8C-api)
  - [이벤트 생성 API](#%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%83%9D%EC%84%B1-api)
  - [보상 등록 API](#%EB%B3%B4%EC%83%81-%EB%93%B1%EB%A1%9D-api)
  - [보상 등록 API](#%EB%B3%B4%EC%83%81-%EB%93%B1%EB%A1%9D-api-1)
  - [이벤트별 보상 목록 조회 API](#%EC%9D%B4%EB%B2%A4%ED%8A%B8%EB%B3%84-%EB%B3%B4%EC%83%81-%EB%AA%A9%EB%A1%9D-%EC%A1%B0%ED%9A%8C-api)
- [고민했던 부분](#%EA%B3%A0%EB%AF%BC%ED%96%88%EB%8D%98-%EB%B6%80%EB%B6%84)
  - [MSA 서비스별 설정 파일 구성 및 공통 모듈 분리](#msa-%EC%84%9C%EB%B9%84%EC%8A%A4%EB%B3%84-%EC%84%A4%EC%A0%95-%ED%8C%8C%EC%9D%BC-%EA%B5%AC%EC%84%B1-%EB%B0%8F-%EA%B3%B5%ED%86%B5-%EB%AA%A8%EB%93%88-%EB%B6%84%EB%A6%AC)
  - [트래픽 대응을 위한 트랜잭션 처리와 MongoDB 설정](#%ED%8A%B8%EB%9E%98%ED%94%BD-%EB%8C%80%EC%9D%91%EC%9D%84-%EC%9C%84%ED%95%9C-%ED%8A%B8%EB%9E%9C%EC%9E%AD%EC%85%98-%EC%B2%98%EB%A6%AC%EC%99%80-mongodb-%EC%84%A4%EC%A0%95)
    - [고민 지점](#%EA%B3%A0%EB%AF%BC-%EC%A7%80%EC%A0%90)
    - [선택 및 구현](#%EC%84%A0%ED%83%9D-%EB%B0%8F-%EA%B5%AC%ED%98%84)
    - [예외 및 실패 이력 보존](#%EC%98%88%EC%99%B8-%EB%B0%8F-%EC%8B%A4%ED%8C%A8-%EC%9D%B4%EB%A0%A5-%EB%B3%B4%EC%A1%B4)
    - [결과 및 효과](#%EA%B2%B0%EA%B3%BC-%EB%B0%8F-%ED%9A%A8%EA%B3%BC)
  - [이벤트 조건 설계: 연속 로그인, 친구 초대](#%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%A1%B0%EA%B1%B4-%EC%84%A4%EA%B3%84-%EC%97%B0%EC%86%8D-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EC%B9%9C%EA%B5%AC-%EC%B4%88%EB%8C%80)
    - [연속 로그인 로직 설계](#%EC%97%B0%EC%86%8D-%EB%A1%9C%EA%B7%B8%EC%9D%B8-%EB%A1%9C%EC%A7%81-%EC%84%A4%EA%B3%84)
    - [친구 초대 로직 설계](#%EC%B9%9C%EA%B5%AC-%EC%B4%88%EB%8C%80-%EB%A1%9C%EC%A7%81-%EC%84%A4%EA%B3%84)
    - [결과 및 효과](#%EA%B2%B0%EA%B3%BC-%EB%B0%8F-%ED%9A%A8%EA%B3%BC-1)
- [구현 예정 기능 및 기술 도입 계획](#%EA%B5%AC%ED%98%84-%EC%98%88%EC%A0%95-%EA%B8%B0%EB%8A%A5-%EB%B0%8F-%EA%B8%B0%EC%88%A0-%EB%8F%84%EC%9E%85-%EA%B3%84%ED%9A%8D)
  - [1. 이벤트 스케줄러를 통한 자동 상태 관리](#1-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%8A%A4%EC%BC%80%EC%A4%84%EB%9F%AC%EB%A5%BC-%ED%86%B5%ED%95%9C-%EC%9E%90%EB%8F%99-%EC%83%81%ED%83%9C-%EA%B4%80%EB%A6%AC)
  - [2. JWT 보안 강화: 액세스/리프레시 토큰 분리](#2-jwt-%EB%B3%B4%EC%95%88-%EA%B0%95%ED%99%94-%EC%95%A1%EC%84%B8%EC%8A%A4%EB%A6%AC%ED%94%84%EB%A0%88%EC%8B%9C-%ED%86%A0%ED%81%B0-%EB%B6%84%EB%A6%AC)
  - [3. 비동기 이벤트 기반 메시지 기술 스택 도입](#3-%EB%B9%84%EB%8F%99%EA%B8%B0-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EA%B8%B0%EB%B0%98-%EB%A9%94%EC%8B%9C%EC%A7%80-%EA%B8%B0%EC%88%A0-%EC%8A%A4%ED%83%9D-%EB%8F%84%EC%9E%85)
  - [4. 이벤트 조건 로직 확장](#4-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EC%A1%B0%EA%B1%B4-%EB%A1%9C%EC%A7%81-%ED%99%95%EC%9E%A5)
  - [5. CI/CD + 테스트 자동화 + 쿠버네티스 도입](#5-cicd--%ED%85%8C%EC%8A%A4%ED%8A%B8-%EC%9E%90%EB%8F%99%ED%99%94--%EC%BF%A0%EB%B2%84%EB%84%A4%ED%8B%B0%EC%8A%A4-%EB%8F%84%EC%9E%85)
- [인사이트](#%EC%9D%B8%EC%82%AC%EC%9D%B4%ED%8A%B8)
  - [1. 신입 개발자로서 MSA 구조를 직접 경험해볼 수 있었던 기회](#1-%EC%8B%A0%EC%9E%85-%EA%B0%9C%EB%B0%9C%EC%9E%90%EB%A1%9C%EC%84%9C-msa-%EA%B5%AC%EC%A1%B0%EB%A5%BC-%EC%A7%81%EC%A0%91-%EA%B2%BD%ED%97%98%ED%95%B4%EB%B3%BC-%EC%88%98-%EC%9E%88%EC%97%88%EB%8D%98-%EA%B8%B0%ED%9A%8C)
  - [2. 확장성과 안정성을 고려한 설계의 중요성](#2-%ED%99%95%EC%9E%A5%EC%84%B1%EA%B3%BC-%EC%95%88%EC%A0%95%EC%84%B1%EC%9D%84-%EA%B3%A0%EB%A0%A4%ED%95%9C-%EC%84%A4%EA%B3%84%EC%9D%98-%EC%A4%91%EC%9A%94%EC%84%B1)
  - [3. NestJS의 데코레이터, 가드, 역할 기반 접근 제어에 대한 실전 경험](#3-nestjs%EC%9D%98-%EB%8D%B0%EC%BD%94%EB%A0%88%EC%9D%B4%ED%84%B0-%EA%B0%80%EB%93%9C-%EC%97%AD%ED%95%A0-%EA%B8%B0%EB%B0%98-%EC%A0%91%EA%B7%BC-%EC%A0%9C%EC%96%B4%EC%97%90-%EB%8C%80%ED%95%9C-%EC%8B%A4%EC%A0%84-%EA%B2%BD%ED%97%98)
- [소감](#%EC%86%8C%EA%B0%90)

<!-- tocstop -->

## 설치방법 및 실행방법

1. 의존성 설치

   - 전체 의존성 설치

     ```shell
     npm install
     ```

   - `auth` 의존성 설치 (auth서비스에서 명령어 실행)

     ```shell
     cd apps/auth
     npm install
     ```

   - `event` 의존성 설치 (event서비스에서 명령어 실행)

     ```shell
     cd apps/event
     npm install
     ```

   - `gateway` 의존성 설치 (gateway서비스에서 명령어 실행)

     ```shell
     cd apps/gateway
     npm install
     ```

2. 환경 변수 설정

   - `auth` .env 파일

     ```
     PORT=3001
     MONGO_URI=mongodb://mongo:27017/auth-db
     JWT_SECRET="veryVeryHardSecretKey"
     ```

   - `event` .env 파일
     ```
     PORT=3002
     MONGO_URI=mongodb://mongo:27017/event-db
     JWT_SECRET="veryVeryHardSecretKey"
     ```
   - `gateway` .env 파일

     ```
     PORT=3000
     AUTH_SERVICE_URL=http://auth:3001
     EVENT_SERVICE_URL=http://event:3002
     JWT_SECRET="veryVeryHardSecretKey"
     ```

3. 프로젝트 실행
   ```shell
   docker-compose up --build
   docker-compose up -d --build   # 백그라운드에서 실행 시
   ```
4. 테스트 실행
   ```
   npm run test
   ```

## 프로젝트 구조 및 설계 개요

NestJS 기반의 모노레포 + MSA 프로젝트로 유지보수성과 확장성을 고려한 구조입니다. 각 서비스는 독립적으로 구동되며 도메인 중심의 설계를 일부 적용하고 있습니다.

```python
reward-assignment-subo/
├── apps/                               # 실제 실행 가능한 MSA 애플리케이션들
│   ├── auth/                           # 사용자 인증 및 사용자 관리 서비스
│   │   └── src/
│   │       └── user/
│   │           ├── controllers/        # 사용자 관련 REST API 컨트롤러
│   │           ├── services/           # 사용자 관련 서비스 로직
│   │           └── user.module.ts      # 사용자 모듈 정의
│   │       ├── app.module.ts           # auth 앱의 루트 모듈
│   │       └── main.ts                 # auth 앱의 실행 진입점
│   ├── event/                          # 이벤트 및 보상 처리 서비스
│   │   └── src/
│   │       ├── claim/                  # 보상 요청 도메인
│   │       │   ├── conditions/         # 이벤트 조건 체크 로직 (e.g. 7일 연속 로그인 등)
│   │       │   ├── controllers/        # 보상 요청/이력 컨트롤러
│   │       │   ├── helpers/            # 실패 시 기록하는 유틸 함수
│   │       │   ├── schema/             # Mongoose 스키마
│   │       │   ├── services/           # 보상 처리 및 조건 검증 서비스
│   │       │   └── claim.module.ts     # claim 관련 모듈 정의
│   │       ├── event/                  # 이벤트 생성 도메인
│   │       │   ├── controllers/        # 이벤트 생성 컨트롤러
│   │       │   ├── schemas/            # 이벤트 스키마
│   │       │   ├── services/           # 이벤트 생성 서비스
│   │       │   ├── types/              # 이벤트 enum 등 타입 정의
│   │       │   └── event.module.ts     # event 모듈 정의
│   │       ├── reward/                 # 보상 조회/생성 도메인
│   │       │   ├── controllers/        # 보상 생성 및 조회 API
│   │       │   ├── schema/             # 보상 스키마
│   │       │   ├── services/           # 보상 서비스
│   │       │   └── reward.module.ts    # reward 모듈 정의
│   │       ├── app.module.ts           # event 앱의 루트 모듈
│   │       └── main.ts                 # event 앱 실행 진입점
│   ├── gateway/                        # BFF 역할의 API 게이트웨이 (각 서비스 연결)
│   │   ├── src/
│   │   │   ├── auth/                   # 인증 관련 guard/strategy
│   │   │   ├── common/                 # axios 에러 핸들링 유틸
│   │   │   ├── controllers/           # 외부 API 엔드포인트 (proxy 역할)
│   │   │   ├── proxy/                 # 내부 서비스에 요청 보내는 프록시 계층
│   │   │   ├── app.module.ts          # gateway 앱의 루트 모듈
│   │   │   └── main.ts                # gateway 실행 진입점
│   │   ├── Dockerfile                 # gateway 서비스의 Docker 설정
│   │   └── package.json               # gateway 전용 의존성 및 스크립트
│   └── tests/                          # 도메인별 테스트 코드 (현재는 event.claim만 존재)
│       └── claim/
│           └── services/
│               └── claim-reward.service.spec.ts  # 보상 로직 유닛 테스트
│
├── docker/                             # Docker 관련 설정
│   ├── .dockerignore
│   └── docker-compose.yml              # 전체 서비스 및 MongoDB 구동 설정
│
├── libs/                               # 전역 공통 모듈 (다른 서비스에서 공유)
│   ├── decorators/                     # 사용자 인증/역할 관련 데코레이터
│   ├── dto/                            # 공통으로 쓰이는 요청 DTO들
│   ├── schemas/                        # 공통 Mongoose 스키마 (유저 등)
│   └── types/                          # 공통 타입 정의
│
├── .env                                # 환경 변수 파일
├── .eslintrc.js                        # ESLint 설정
├── .gitignore                          # Git에서 제외할 파일
├── .prettierrc                         # 코드 포맷팅 설정
├── jest.config.js                      # Jest 설정
├── nest-cli.json                       # Nest CLI 설정
├── package-lock.json
├── package.json                        # 프로젝트 전체 의존성 및 스크립트
├── README.md                           # 프로젝트 설명 파일
└── tsconfig.json                       # TypeScript 설정
```

---

### 1. MSA 아키텍처와 모노레포 구성

- `apps/` 디렉터리 하위에 인증(auth), 이벤트/보상(event), 게이트웨이(gateway) 서비스가 나뉘어 있으며 각 서비스는 자체적인 모듈, 컨트롤러, 서비스, 스키마를 포함합였습니다.
- 서비스 간 중복되는 공통 코드는 `libs/` 하위로 추출되어 공용 모듈로 관리하였습니다.
- 이 구조는 서비스별 **독립적인 테스트** 및 **배포**, **관심사 분리**, **의존성 최소화**에 신경쓰고 설계하였습니다.

---

### 2. 도메인 단위의 구조 분리 (DDD 스타일 일부 적용)

- 각 서비스 내부는 도메인(`claim`, `event`, `reward`, `user`) 기준으로 디렉터리 구조가 구성되어 있습니다.
- 도메인 내부는 다음과 같은 폴더 계층으로 나누었습니다. :
  - `controllers/`: 요청 처리 및 라우팅
  - `services/`: 핵심 비즈니스 로직
  - `schema/`: Mongoose 스키마 정의
  - `conditions/`, `helpers/`: 검증 및 유틸 처리
- 이러한 구조 역시 **기능 단위 유지보수**와 **단위 테스트**에 적합하다고 판단했습니다.

---

### 3. 공통 유틸리티 및 설정 파일 분리

- `libs/` 하위에는 다음과 같은 공통 유틸이 포함되어 있습니다. :
  - `dto/`: 요청 및 응답 구조 정의
  - `schemas/`: 유저/추천인 등 공통 스키마
  - `decorators/`: 인증 관련 커스텀 데코레이터
  - `types/`: 인터페이스 및 공통 타입 선언
- 중복 로직 제거와 **코드 일관성 유지**, **서비스간 결합도 낮추는 것**을 목표로 구성했습니다.

---

### 4. Docker 기반의 로컬 개발 환경(요구 사항)

- `docker-compose.yml`을 이용하여 MongoDB와 각 NestJS 서비스 컨테이너를 통합 실행 할 수 있습니다.
- 각 서비스는 별도의 `Dockerfile`을 통해 빌드되며, 개발 및 운영 환경을 고려한 설정이 포함되어 있습니다.
- 빠른 셋업과 실행을 위한 환경을 제공해줍니다.

---

### 5. 환경 변수와 설정 관리 전략

- 각 서비스는 `.env` 파일을 통해 DB URI, JWT 시크릿, 포트 정보 등의 민감한 설정 값을 받도록 했습니다.
- CI/CD 환경에서도 서비스별 환경 설정을 자동으로 주입하기 위해 사용하였습니다.

---

### 6. 확장성과 운영 고려 사항

- 각 서비스는 **독립적인 `main.ts` 및 `AppModule`**을 기준으로 동작하게되며 이후 Docker/Kubernetes 환경에서 **서비스 단위**로 **개별 배포 및 확장**이 가능하도록 설계하였습니다.
- 서비스 간 공통 로직(예: DTO, 데코레이터, 공통 타입 등)은 `libs/` 디렉터리로 분리하여, 중복 없이 **재사용 가능**하며 새로운 서비스 추가 시 **최소한의 변경**만으로 적용할 수 있게 설계하였습니다 .
- 현재는 HTTP 기반 동기 요청으로 통신하고 있지만, 향후 Kafka, RabbitMQ 등 메시지 큐 기반의 비동기 이벤트 아키텍처로 전환할 수 있도록 서비스 간 **직접 의존**을 최소화한 구조로 구성했습니다.
- 이벤트 조건 체크, 로그인 기록 저장, 추천인 기록 등 다양한 도메인 처리 로직이 트랜잭션 및 상태 일관성을 보장할 수 있도록 MongoDB Replica Set 및 트랜잭션 기반으로 처리하였으며 추후 대량 트래픽 상황에서도 안정적으로 동작할 수 있도록 고려하여 설계했습니다.

## 서비스별 구성 및 역할

본 프로젝트는 NestJS 기반의 **MSA(Microservice Architecture)**로 구성되어 있으며, 주요 서비스는 다음과 같이 분리되어 있습니다.

### Auth 서비스

- **주요 역할**

  - 회원가입 및 로그인 처리
  - 이메일 인증 / 닉네임 변경 / 프로필 수정
  - 유저 권한(Role: USER, OPERATOR, ADMIN 등) 관리
  - 추천인 코드 기반 초대 로직 및 추천인 저장

- **기술 포인트**
  - JWT 기반 인증 및 `@CurrentUser` 데코레이터 사용
  - 로그인 시 `UserLogin` 컬렉션에 기록하여 이벤트 조건으로 활용 가능
  - `Referral` 스키마를 이용한 초대 기능 구현
  - 비밀번호 해싱, 이메일 중복 체크 등 기본 보안 요소 포함
  - 모든 인증 관련 로직은 공통 `libs/`로 분리하여 재사용성 확보

---

### Event 서비스

- **주요 역할**

  - 이벤트 등록 및 관리 (이벤트 기간, 조건, 상태 관리)
  - 이벤트 보상 등록 및 수량 관리
  - 조건 검증 기반 보상 수령 처리 (ex: 연속 로그인, 친구 초대 등)

- **기술 포인트**
  - `Event`, `Reward`, `Claim` 3가지 도메인을 기반으로 명확히 분리된 구조
  - `EventConditionCheckerService`를 통해 조건별 검증 클래스 플러그인 방식으로 설계
  - MongoDB 트랜잭션 및 Replica Set 구성으로 동시성 보장 (`reward.quantity` 감소 등)
  - 보상 실패 이력 저장(`saveFailedClaim`)을 통한 추적 가능성 확보
  - 이벤트 상태는 cron 기반 스케줄러로 자동 갱신 예정

---

### Gateway 서비스

- **주요 역할**

  - 외부 클라이언트 요청을 받아 알맞은 서비스로 라우팅
  - 인증 정보 전달 및 JWT 인증 필터링
  - API 문서(OpenAPI) 통합 제공 예정

- **기술 포인트**
  - NestJS의 `HttpService` + Proxy 구조를 활용하여 각 서비스에 요청을 위임
  - 단일 도메인을 통해 MSA 구조를 감싼 일관된 진입점 역할 수행
  - 서비스 간 라우팅 경로는 `.env` 기반 URL 구성으로 유연하게 관리
  - 인증이 필요한 API는 `JwtAuthGuard` 및 `RolesGuard`를 통해 처리

---

### 공통 모듈 (`libs/`)

- **역할 및 구성**

  - `libs/dto`: 서비스 간 공유되는 DTO 클래스
  - `libs/decorators`: 인증 관련 커스텀 데코레이터 (예: `@CurrentUser`, `@Public`)
  - `libs/types`: enum, 인터페이스 등 공통 타입 정의
  - `libs/schemas`: 공용 스키마 정의 (ex: `User`, `Referral`, `UserLogin` 등)

- **기술 포인트**
  - 각 서비스 간 중복 없이 재사용 가능하도록 구조화
  - 의존성 최소화 및 코드 일관성 확보
  - 테스트와 유지보수에 유리한 구조 제공

## 데이터베이스 모델(ERD)

<div align="left">
<img width="700" src="https://github.com/user-attachments/assets/862d2502-988b-4f25-b39a-8d357d72361c">
</div>

---

### User

**유저 정보를 담는 핵심 테이블**로서 인증, 권한, 추천 코드 등 유저 관련 전반을 저장합니다.

- `email`: 회원 가입 시 입력한 이메일 주소이며, 유일(unique)해야 합니다. 로그인에 사용됩니다.

- `password`: bcrypt로 해싱된 비밀번호가 저장됩니다.
- `role`: UserRole 열거형(enum)으로 저장되며, 권한 구분(USER, OPERATOR, AUDITOR,ADMIN )에 사용됩니다.
- `birthDate`: 유저의 생년월일을 저장합니다.
- `nickname`: 유저의 닉네임 입니다. (선택 필드로 이벤트 조건으로 활용됩니다.)
- `bio`: 자기소개입니다. (선택 필드로 이벤트 조건으로 활용됩니다.)
- `profileImageUrl`: 프로필 이미지 URL이 저장됩니다. (선택 필드로 이벤트 조건으로 활용됩니다.)
- `inviteCode`: 자동 생성되는 추천인 코드(unique)이며 초대 시스템(이벤트 조건)에 사용됩니다.
- `createdAt`: 생성 시간이 저장됩니다. (자동으로 만들어지면 이벤트 조건으로 활용됩니다.)
- `updatedAt`: 수정 시간이 저장됩니다. (자동)

---

### Referral

**유저 간 초대/추천 관계**를 나타내는 테이블입니다.

- `inviterId`: 초대한 유저의 `_id` (User 참조)가 저장됩니다.

- `inviteeId`: 초대를 받은 유저의 `_id` (User 참조, unique) 가 저장됩니다.
- `createdAt`: 생성 시간 (자동)
- `updatedAt`: 수정 시간 (자동)

---

### UserLogin

**유저의 로그인 기록을 저장하는 테이블**입니다. 이벤트 조건(7일 연속 로그인) 평가에 사용됩니다.

- `userId`: 로그인한 유저의 `_id` (User 참조)가 저장됩니다.

- `loginAt`: 로그인 시각이 저장됩니다.
- `userId + loginAt`: 복합 인덱스를 적용하여 중복 방지 및 조회 최적화 시켰습니다. (B-Tree)

---

### Event

**이벤트 정보 테이블**로, 특정 보상 조건에 따라 유저 보상을 지급하기 위한 기준이 되는 도메인입니다.

- `name`: 이벤트 이름

- `description`: 이벤트 설명이 저장됩니다.
- `startDate`: 이벤트 시작일이 저장됩니다.
- `endDate`: 이벤트 종료일이 저장됩니다.
- `status`: 현재 상태 (scheduled, active, ended)가 저장됩니다.
- `rewardType`: 보상 지급 방식 (once, daily, weekly)가 저장됩니다.
- `maxRewardCount`: 최대 보상 수량을 나타냅니다.
- `condition`: 이벤트 발동 조건 (enum: EventCondition)을 명시합니다.
- `createdAt`: 생성 시간 (자동)
- `updatedAt`: 수정 시간 (자동)

---

### Reward

**이벤트에 따른 보상 정보를 저장하는 테이블**입니다. 이벤트에 종속되며 수량 제한 여부도 관리합니다.

- `name`: 보상 이름을 나타냅니다.

- `description`: 보상 설명을 나타냅니다.
- `eventId`: 해당 보상이 속한 이벤트의 `_id`를 참조합니다.
- `quantity`: 잔여 수량를 나타냅니다.
- `isLimited`: 수량 제한 여부를 나타냅니다. (true이면 제한 없이 받을 수 있습니다.)
- `createdAt`: 생성 시간을 나타냅니다.
- `updatedAt`: 수정 시간을 나타냅니다.

---

### Claim

**유저가 이벤트에 참여해 보상을 수령한 내역을 저장하는 테이블**입니다.

- `userId`: 보상을 수령한 유저의 `_id`을 참조합니다.

- `rewardId`: 수령한 보상의 `_id`을 참조합니다.
- `eventId`: 관련된 이벤트의 `_id`을 참조합니다.
- `status`: 보상 상태 ("success" | "failed")을 나타냅니다.
- `reason`: 실패 사유 (선택 필드)를 나타냅니다.
- `createdAt`: 생성 시간을 나타냅니다.
- `updatedAt`: 수정 시간을 나타냅니다.
- `userId + eventId`: 유니크 제약 조건을 걸어 중복 수령 방지로 활용됩니다.

---

## API 명세서

### 회원가입 API

- **요청**

  ```shell
  $ curl -X POST http://localhost:3000/auth/signup
    -H "Content-Type: application/json"
    -d '{
      "email": "test@example.com",
      "password": "12345678",
      "birthDate": "1995-01-01"
    }'
  ```

- **응답**

  ```javascript
  {
    "id": "user_id",
    "email": "test@example.com",
    "role": "USER"
  }
  ```

- 신규 사용자를 생성합니다.
- 이메일이 중복되면 409 Conflict 에러가 발생합니다.
- 비밀번호는 최소 6자리 이상이어야 합니다.
- birthDate는 필수 항목입니다.

---

### 로그인 API

- **요청**

  ```shell
  $ curl -X POST http://localhost:3000/auth/login
    -H "Content-Type: application/json"
    -d '{
      "email": "test@example.com",
      "password": "12345678"
    }'
  ```

- **응답**

  ```javascript
  {
    "accessToken": "access_token",
    "refreshToken": "refresh_token"
  }
  ```

- 로그인 성공 시 access 및 refresh 토큰을 반환합니다.
- 유효하지 않은 계정/비밀번호 조합일 경우 401 Unauthorized 에러가 발생합니다.
- 로그인 시 로그인 기록(UserLogin)에 기록됩니다.

---

### 내 정보 조회 API

- **요청**

  ```shell
  $ curl -X GET http://localhost:3000/auth/me
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **응답**

  ```javascript
  {
    "message": "내 정보 조회 성공했습니다.",
    "user": {
      "id": "user_id",
      "email": "test@example.com",
      "role": "USER"
    }
  }
  ```

- 로그인된 유저의 정보를 조회합니다.
- 인증된 사용자만 접근 가능합니다.

---

### 프로필 수정 API

- **요청**

  ```shell
  $ curl -X PATCH http://localhost:3000/auth/profile \
    -H "Authorization: Bearer <ACCESS_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{
      "nickname": "개발자",
      "bio": "나는 백엔드 개발자입니다."
      "profileImageUrl": <프로필 이미지 Url>
    }'
  ```

- **응답**

  ```javascript
  {
    "message": "프로필 수정에 성공했습니다.",
    "user": {
      "nickname": "개발자",
      "bio": "나는 백엔드 개발자입니다."
      "profileImageUrl": "<프로필 이미지 Url>"
    }
  }
  ```

- 사용자 본인의 프로필 정보를 수정합니다.
- 닉네임은 공백만 입력할 수 없으며, 중복된 닉네임 사용 시 409 Conflict 발생합니다.

---

### 추천 코드 조회 API

- **요청**

  ```shell
  $ curl -X GET http://localhost:3000/auth/invite-code
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **응답**

  ```javascript
  {
    "inviteCode": "abc123xyz"
  }
  ```

- 유저의 추천 코드를 조회합니다.
- 추천 코드가 존재하지 않거나 오류가 발생한 경우 500 InternalServerError 반환합니다.

---

### 유저 권한 변경 API

- **요청**

  ```shell
  $ curl -X PATCH http://localhost:3000/auth/users/{userId}/role \
    -H "Authorization: Bearer <ACCESS_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{
      "role": "OPERATOR"
    }'
  ```

- **응답**

  ```javascript
  {
    "message": "역할이 성공적으로 변경되었습니다.",
    "user": {
      "id": "userId",
      "email": "admin@example.com",
      "role": "OPERATOR"
    }
  }
  ```

- ADMIN, OPERATOR만 호출 가능하며 유효하지 않은 역할이면 400 BadRequest를 반환합니다.
- 동일한 역할로 변경 시 409 Conflict를 반환합니다.

---

### 보상 요청 API

- **요청**

  ```shell
  $ curl -X POST http://localhost:3000/claims/{rewardId}/claim
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **응답**

  ```javascript
  {
    "message": "보상 요청이 성공했습니다.",
    "claim": {
      "_id": "claimId",
      "status": "success"
    }
  }
  ```

- 유저는 특정 보상을 한 번만 받을 수 있습니다 (eventId 기준)
- 조건 불충족, 중복 요청, 수량 소진 시 400, 409 반환를 반환합니다.

---

### 내 보상 이력 조회 API

- **요청**

  ```shell
  $ curl -X GET http://localhost:3000/claims/me
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **응답**

  ```javascript
  {
    "message": "보상 이력 조회에 성공했습니다.",
    "claims": [
      {
        "_id": "664b289fc228c7fabcde1234",
        "userId": "664b1122aaabbbcccddd0001",
        "rewardId": {
          "_id": "664b2222aaabbbcccddd0002",
          "name": "500포인트",
          "description": "7일 연속 로그인 시 지급",
          "eventId": "664b3333aaabbbcccddd0003",
          "quantity": 10,
          "isLimited": true,
          "createdAt": "2025-05-01T12:00:00",
          "updatedAt": "2025-05-05T12:00:00"
        },
        "eventId": "664b3333aaabbbcccddd0003",
        "status": "success",
        "createdAt": "2025-05-06T12:30:00",
        "updatedAt": "2025-05-06T12:30:00"
      }
    ]
  }
  ```

- 본인의 보상 이력을 확인할 수 있는 API 입니다.
-     모든 역할에 대해 접근이 가능합니다.

---

### 전체 보상 이력 조회 API

- **요청**

  ```shell
  $ curl -X GET http://localhost:3000/claims \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **응답**

  ```javascript
  {
    "message": "전체 보상 이력 조회에 성공했습니다.",
    "claims": [
      {
        "_id": "664b289fc228c7fabcde1234",
        "userId": "664b1122aaabbbcccddd0001",
        "rewardId": {
          "_id": "664b2222aaabbbcccddd0002",
          "name": "500포인트",
          "description": "7일 연속 로그인 시 지급",
          "eventId": "664b3333aaabbbcccddd0003",
          "quantity": 10,
          "isLimited": true,
          "createdAt": "2025-05-01T12:00:00.000Z",
          "updatedAt": "2025-05-05T12:00:00.000Z"
        },
        "eventId": "664b3333aaabbbcccddd0003",
        "status": "success",
        "createdAt": "2025-05-06T12:30:00.000Z",
        "updatedAt": "2025-05-06T12:30:00.000Z"
      },
      {
        "_id": "664b28aa1122c7fabcde5678",
        "userId": "664b1122aaabbbcccddd0004",
        "rewardId": {
          "_id": "664b2233aaabbbcccddd0005",
          "name": "1000포인트",
          "description": "프로필 완성 시 지급",
          "eventId": "664b3344aaabbbcccddd0006",
          "quantity": 5,
          "isLimited": false,
          "createdAt": "2025-05-02T08:00:00.000Z",
          "updatedAt": "2025-05-06T09:00:00.000Z"
        },
        "eventId": "664b3344aaabbbcccddd0006",
        "status": "success",
        "createdAt": "2025-05-07T10:00:00.000Z",
        "updatedAt": "2025-05-07T10:00:00.000Z"
      }
    ]
  }
  ```

- ADMIN, OPERATOR, AUDITOR만 사용 가능이 가능합니다.
- 모든 유저의 보상 요청 결과를 반환해줍니다.

---

### 특정 유저 보상 이력 조회 API

- **요청**

  ```shell
  $ curl -X GET http://localhost:3000/claims/user/{userId} \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **응답**

  ```javascript
  {
    "message": "유저(userId)의 보상 이력 조회에 성공했습니다.",
    "claims": [{
      "_id": "664b289fc228c7fabcde1234",
      "userId": "664b1122aaabbbcccddd0001",
      "rewardId": {
        "_id": "664b2222aaabbbcccddd0002",
        "name": "500포인트",
        "description": "7일 연속 로그인 시 지급",
        "eventId": "664b3333aaabbbcccddd0003",
        "quantity": 10,
        "isLimited": true,
        "createdAt": "2025-05-01T12:00:00",
        "updatedAt": "2025-05-05T12:00:00"
      },
      "eventId": "664b3333aaabbbcccddd0003",
      "status": "success",
      "createdAt": "2025-05-06T12:30:00",
      "updatedAt": "2025-05-06T12:30:00"
    }]
  }
  ```

- 관리자 권한 이상만 사용이 가능합니다.
- 유저 ID 기준 보상 이력을 조회합니다.

---

### 필터링된 보상 이력 조회 API

- **요청**

  ```shell
  $ curl -X GET 'http://localhost:3000/claims/filter?status=success&eventId=event123' \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **응답**

  ```javascript
  {
    "message": "필터링된 보상 이력 조회에 성공했습니다.",
    "claims": [{
      "_id": "664b289fc228c7fabcde1234",
      "userId": "664b1122aaabbbcccddd0001",
      "rewardId": {
        "_id": "664b2222aaabbbcccddd0002",
        "name": "500포인트",
        "description": "7일 연속 로그인 시 지급",
        "eventId": "664b3333aaabbbcccddd0003",
        "quantity": 10,
        "isLimited": true,
        "createdAt": "2025-05-01T12:00:00",
        "updatedAt": "2025-05-05T12:00:00"
      },
      "eventId": "664b3333aaabbbcccddd0003",
      "status": "success",
      "createdAt": "2025-05-06T12:30:00",
      "updatedAt": "2025-05-06T12:30:00"
    }]
  }
  ```

- 상태(success, failed), 유저 ID, 이벤트 ID 등으로 필터링 가능합니다.
- 관리자 권한 이상만 호출 가능합니다.

---

### 이벤트 생성 API

- **요청**

  ```shell
  $ curl -X POST http://localhost:3000/events \
    -H "Authorization: Bearer <ACCESS_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "7일 연속 로그인 이벤트",
      "startDate": "2025-01-01T00:00:00Z",
      "endDate": "2025-01-31T00:00:00Z",
      "condition": "DAILY_LOGIN_7_DAYS"
    }'
  ```

- **응답**

  ```javascript
  {
    "_id": "eventId",
    "name": "7일 연속 로그인 이벤트"
  }
  ```

- 관리자는 이벤트를 등록할 수 있습니다.
- 이벤트 시작일은 종료일보다 이전이어야 합니다
- 이름 중복이 불가능합니다.

---

### 보상 등록 API

- **요청**

  ```shell
  $ curl -X POST http://localhost:3000/rewards \
    -H "Authorization: Bearer <ACCESS_TOKEN>" \
    -H "Content-Type: application/json" \
    -d '{
      "name": "500포인트",
      "eventId": "eventId",
      "quantity": 10,
      "isLimited": true
    }'
  ```

- **응답**

  ```javascript
  {
    "message": "보상 등록에 성공했습니다.",
    "reward": {
      "name": "500포인트",
      "quantity": 10
    }
  }
  ```

- 관리자는 보상를 등록할 수 있습니다.
- 유효한 이벤트 ID 필요합니다.
- 수량을 나타낼 수 있습니다.
- 제한을 걸어 한 유저당 한번만 받게 할 수 있습니다.

---

### 보상 등록 API

- **요청**

  ```shell
  $ curl -X GET http://localhost:3000/rewards \
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **응답**

  ```javascript
  {
    "message": "보상 목록 조회에 성공했습니다.",
    "rewards": [{
      "_id": "664b289fc228c7fabcde1234",
      "userId": "664b1122aaabbbcccddd0001",
      "rewardId": {
        "_id": "664b2222aaabbbcccddd0002",
        "name": "500포인트",
        "description": "7일 연속 로그인 시 지급",
        "eventId": "664b3333aaabbbcccddd0003",
        "quantity": 10,
        "isLimited": true,
        "createdAt": "2025-05-01T12:00:00",
        "updatedAt": "2025-05-05T12:00:00"
      },
      "eventId": "664b3333aaabbbcccddd0003",
      "status": "success",
      "createdAt": "2025-05-06T12:30:00",
      "updatedAt": "2025-05-06T12:30:00"
    }]
  }
  ```

- 모든 등록된 보상을 조회할 수 있습니다.
- ADMIN, AUDITOR만 접근이 가능합니다.

---

### 이벤트별 보상 목록 조회 API

- **요청**

  ```shell
  $ curl -X GET http://localhost:3000/rewards/event/{eventId}
    -H "Authorization: Bearer <ACCESS_TOKEN>"
  ```

- **응답**

  ```javascript
  {
    "message": "이벤트별 보상 조회에 성공했습니다.",
    "rewards": [{
      "_id": "664b289fc228c7fabcde1234",
      "userId": "664b1122aaabbbcccddd0001",
      "rewardId": {
        "_id": "664b2222aaabbbcccddd0002",
        "name": "500포인트",
        "description": "7일 연속 로그인 시 지급",
        "eventId": "664b3333aaabbbcccddd0003",
        "quantity": 10,
        "isLimited": true,
        "createdAt": "2025-05-01T12:00:00",
        "updatedAt": "2025-05-05T12:00:00"
      },
      "eventId": "664b3333aaabbbcccddd0003",
      "status": "success",
      "createdAt": "2025-05-06T12:30:00",
      "updatedAt": "2025-05-06T12:30:00"
    }]
  }
  ```

- 이벤트 ID에 해당하는 보상 목록을 반환합니다.
-     관리자 권한 이상만 접근이 가능합니다.

## 고민했던 부분

### MSA 서비스별 설정 파일 구성 및 공통 모듈 분리

- **고민 지점**

  - 각 서비스(`auth`, `event`, `gateway`)는 독립적으로 동작해야 하므로 설정 파일(`tsconfig`, `alias`)을 어디에 위치시켜야 하는가?
    - 각 서비스마다 `tsconfig.json`을 둘 것인가?
    - 또는 루트에 공통 설정 파일을 두고 이를 `extends`하는 방식으로 할 것인가?
  - 서비스 내부에서만 사용하던 타입/데코레이터 등을 언제, 어떻게 `libs/`로 추출할 것인가?
    - 서비스 간 의존성은 없애고 코드 중복은 피하고 싶은 상황이였습니다.

- **선택 이유** (**루트에 공통 설정**)

  - 설정 파일은 루트에 `tsconfig.base.json`을 두고 각 서비스에서는 이를 `extends`하였습니다.
    - 각 서비스가 동일한 경로 alias 및 타입 체크 환경을 유지할 수 있어 선택했습니다.
    - 도구 설정(ESLint, Jest 등)도 루트 기준으로 일관성 있게 구성 가능해서 선택했습니다.
  - 공통 모듈(`UserRole`, `@CurrentUser()`, `CreateUserDto` 등)은 처음엔 각 서비스에 위치했지만 다른 서비스에서도 사용되며 중복이 생기자 `libs/` 디렉토리로 상향 이동시켜 주었습니다.
    - `libs/dto/`: 요청/응답 DTO
    - `libs/decorators/`: 인증 관련 커스텀 데코레이터
    - `libs/schemas/`: 공용 Mongoose 스키마
    - `libs/types/`: 인터페이스, 열거형, 공통 타입

- **결과 및 이점**
  - 서비스 간 결합도는 낮추고 중복 없이 일관성 있게 유지보수 가능하게 했습니다.
  - 각 서비스는 독립적으로 개발 및 테스트가 가능하면서도,
  - 필요한 공통 요소는 `libs/`를 통해 공유함으로써 재사용성과 일관성을 모두 확보하였습니다.

### 트래픽 대응을 위한 트랜잭션 처리와 MongoDB 설정

> 보상 요청이 동시에 다수 발생할 수 있는 구조에서 **데이터 정합성**을 유지하고 **동시성 문제**를 방지하기 위해 트랜잭션과 예외 처리를 도입하고 신경썼습니다.

#### 고민 지점

- MongoDB는 기본적으로 단일 문서 단위의 원자성만 보장됩니다.

- `Claim`, `Reward`, `Event`는 서로 다른 컬렉션으로 **여러 문서 간의 트랜잭션**이 필요하게 되었습니다.

- 특히 보상을 요청하는데 있어 `Reward.quantity`는 동시 요청 시 음수로 내려갈 수도 있고 보상 지급이 꼬일 수 있어 **수량 감소에 대한 동시성 제어**가 필요한 상황이였습니다.

#### 선택 및 구현

1. **Replica Set 구성**

   - NestJS + Mongoose에서 트랜잭션 사용을 위해 MongoDB를 `Replica Set`으로 구성하였습니다.
   - `docker-compose.yml`에 아래와 같이 설정하였습니다.
     ```yaml
     command: ["--replSet", "rs0"]
     ```
   - 컨테이너 기동 후 MongoDB 셸에서 다음 명령어로 초기화 해줬습니다.
     ```bash
     rs.initiate()
     ```

2. **트랜잭션 기반 처리**

   - NestJS에서 `startSession()` → `startTransaction()`으로 트랜잭션을 시작하였습니다.
   - `Reward`, `Event`, `Claim` 관련 작업을 모두 **하나의 트랜잭션** 안에서 수행하여 정합성을 확보했습니다.

3. **수량 감소 동시성 제어**
   - 다음과 같이 조건부 업데이트를 통해 수량이 0 이상일 때만 감소하도록 처리하였습니다.
     ```ts
     const result = await this.rewardModel.updateOne(
       { _id: rewardId, quantity: { $gt: 0 } },
       { $inc: { quantity: -1 } },
       { session },
     );
     ```
   - `modifiedCount`가 0이면 보상이 이미 소진된 것으로 간주하여 예외를 발생시키도록 했습니다.

#### 예외 및 실패 이력 보존

- 트랜잭션 처리 도중 예외가 발생할 경우, `session.abortTransaction()`을 호출하여 모든 작업을 롤백하여 **데이터 정합성**을 유지했습니다.
- 롤백 이후에도 문제가 발생한 요청에 대한 이력을 남기기 위해, `saveFailedClaim()` 헬퍼를 통해 유저 ID, 보상 ID, 에러 메시지를 포함한 실패 이력을 `Claim` 컬렉션에 별도로 기록하였습니다.
- 이러한 방식은 운영 환경에서 장애 추적 및 원인 분석에 활용할 수 있는 중요한 로깅 구조라고 판단했습니다.

#### 결과 및 효과

- 보상 요청 처리에서 발생할 수 있는 중복 수령, 재고 초과, 조건 미충족 등 다양한 예외 상황에 대해 사전 방지 로직과 트랜잭션을 통해 **데이터 무결성**과 **일관성**을 확보했습니다.
- MongoDB의 트랜잭션 기능을 기반으로 `Claim`, `Reward`, `Event` 간의 연관된 작업을 원자적으로 처리함으로써 다수의 요청이 동시에 들어오는 상황에서도 **신뢰성 있는 보상 처리**가 가능해졌습니다.
- 실패한 요청에 대해서도 별도로 로깅을 수행해 **장애 추적성**과 운영 중 **에러 진단**에 유용한 데이터를 축적할 수 있도록 설계했습니다.
- **실제 운영 환경**에서 발생할 수 있는 에러 사항들과 예외 시나리오까지 포괄적으로 대응 가능하도록 설계했습니다.


### 이벤트 조건 설계: 연속 로그인, 친구 초대

> 이벤트 조건을 판단하기 위한 로직과 DB 구조에 대해, **확장성, 유연성, 성능**을 고려하여 다음과 같은 방향으로 설계하였습니다.

#### 연속 로그인 로직 설계

- **고민 지점**

  - 유저의 로그인 이력을 어떻게 저장하고 검증할 것인가?
    - 날짜 단위로 **독립적인 로그인 로그**를 기록
    - `User` 스키마 안에 `loginHistory: Date[]` 필드를 추가해 **배열로 저장**
  - 어떻게 검증 할 것인가?
    - 이벤트 발생 시 `UserLogin`기록 전체를 불러와 **일괄 검증**
    - 또는 로그인할 때마다 **누적 상태 필드**를 갱신하여 연속 여부를 관리

- **선택 이유** (**별도의 컬렉션**, **일괄 검증**)
  - 유연하고 명확한 검증을 위해 `UserLogin`을 별도 컬렉션으로 분리하였습니다.
    - 배열로 저장 시, 문서 크기 증가 및 접근 비용 증가 가능성이 존재
    - 독립 컬렉션으로 관리하면 다양한 쿼리 조건, 인덱싱 최적화가 가능
  - 연속 로그인 조건은 다음과 같이 검증:
    - 최근 7일 날짜를 기준으로 `userId`, `loginAt` 조건으로 쿼리
    - 이후 **연속된 날짜가 7일 이상 존재하는지 여부**를 판단
  - **추후 다양한 이벤트 조건(예: 월간 로그인, 주말 로그인 등)**도 같은 구조로 쉽게 확장 가능


#### 친구 초대 로직 설계

- **고민 지점**

  - 추천인 관계를 어떻게 표현할 것인가?
    - `User` 모델 내부에 `inviterId[]` 식으로 배열로 보관
    - 별도의 `Referral` 컬렉션을 두어 `inviterId`, `inviteeId` 구성

- **선택 이유**(**별도의 컬렉션**)
  - 1:N 관계 확장성과 추천 이력 관리의 독립성을 위해 `Referral` 테이블을 별도 구성
    - 추후 추천 이벤트 보상 이력 관리, 분석 로직 등 확장성을 고려하였습니다.
  - `inviteeId`에 유니크 인덱스를 설정하여 **중복 초대 방지** 구현을 단순화하였습니다.
  - 컬렉션을 분리함으로써 책임을 명확히 분리하고 그에 따라 쿼리 복잡도를 줄일수 있고 테스트 작성, 유지보수를 용이하게 만들 수 있어 이 방식을 선택했습니다.

#### 결과 및 효과

- `UserLogin`, `Referral`과 같이 조건 검증을 위한 정보를 **독립 컬렉션**으로 분리함으로써 이벤트 추가 및 조건 변경이 발생하더라도 기존 시스템에 영향을 주지 않고 **유연하게 대응**할 수 있는 구조를 마련했습니다.
- 로그인 이력, 초대 이력 등 다양한 기준을 기반으로 **사용자 행동을 분석**하고 이벤트 정책을 개선하는 데 필요한 **데이터 수집**과 **조회 효율성**을 확보했습니다.
- 컬렉션 분리를 통해 쿼리 단순화와 책임 분리, 인덱싱 최적화가 가능해졌고 테스트 및 운영 중 장애 분석에서도 장점이 있습니다.
- 궁극적으로 유저 이벤트 조건 검증의 **신뢰도를 높이고** 이벤트 중심 플랫폼의 **안정성과 확장성**을 함께 확보할 수 있는 기반이 되었습니다.

## 구현 예정 기능 및 기술 도입 계획

### 1. 이벤트 스케줄러를 통한 자동 상태 관리

- **내용**: 이벤트의 `startDate`, `endDate` 기준으로 상태(`scheduled`, `active`, `ended`)를 자동으로 갱신합니다.

- **방법**
  - NestJS의 `@Schedule` 데코레이터 또는 `cron` 기반 스케줄러 도입
  - 매 분 또는 매 시각마다 이벤트 상태를 점검하고 DB 업데이트
- **효과**
  - 관리자가 수동으로 상태를 변경할 필요 없이, 이벤트 활성화/종료 시점을 자동화 할 수 있습니다.
  - 운영 중 실수 최소화 및 이벤트 관리 효율 향상시킬 수 있습니다.

### 2. JWT 보안 강화: 액세스/리프레시 토큰 분리

- **내용**: 로그인 유저 인증 시스템 보안성 향상 시킬 수 있습니다.

- **방법**
  - Access Token: 유효기간 짧게 설정 (15~30분)
  - Refresh Token: HttpOnly 쿠키에 저장하고, 별도 API로 갱신
  - 토큰 탈취 방지를 위해 사용자 정보와 Refresh Token의 매핑 관리
- **효과**
  - 탈취 위험이 있는 Access Token을 짧은 주기로 갱신해 보안을 강화 할 수 있습니다.
  - 재로그인 없이 자동 갱신되는 UX 제공해 줄 수 있습니다.

### 3. 비동기 이벤트 기반 메시지 기술 스택 도입

- **내용**: 유저 요청 증가에 대비해 각 서비스 간 느슨한 결합 구조로 개선

- **방법**
  - Kafka, RabbitMQ 등 메시지 브로커를 통해 이벤트 기반 처리 구조 도입
- **효과**
  - 보상 요청 시 바로 응답하고 내부적으로 Kafka를 통해 `reward.claimed` 이벤트를 발행 → 로깅, 통계, 알림 등은 별도 서비스에서 처리
- **예상 효과**
  - 대규모 트랙픽 상황에서 응답 지연 없이 처리할 수 있습니다.
  - 서비스 간 의존도 감소하여 장애 격리 및 스케일 아웃 용이하게 할 수 있습니다.

### 4. 이벤트 조건 로직 확장

- **내용**: 다양한 사용자 행동 기반 이벤트 구현

  - PC방 로그인 여부
  - 설문조사 응답 여부
  - 누적 사용 시간
  - 구매 횟수 등

- **방법**

  - 각 조건별로 `Validator` 클래스를 작성해 `EventConditionCheckerService`에 플러그인 형태로 주입
  - 유연하고 유지보수 쉬운 조건 추가 구조 유지

- **효과**
  - 다양한 유형의 이벤트를 손쉽게 확장 가능합니다.
  - 조건 추가가 새로운 서비스 개발 없이도 가능해져 유지보수 및 기획 대응 속도 향상시킬 수 있습니다.
  - 조건 로직이 각기 독립된 클래스로 분리되어 있어 **테스트 용이성** 및 **코드 재사용성** 확보할 수 있습니다.
  - 이벤트 기획 변경 및 마케팅 요구에 빠르게 대응할 수 있는 **유연한 시스템 아키텍처** 확보할 수 있습니다.


### 5. CI/CD + 테스트 자동화 + 쿠버네티스 도입

- **내용**: 안정적인 배포 환경 및 개발 생산성 향상시키는데 도움을 줍니다.

- **방법**
  - GitHub Actions로 PR 및 main 브랜치 푸시 시 테스트 → 빌드 → 배포 자동화
  - 단위 테스트 통과 시 Docker 이미지 빌드 후 쿠버네티스 클러스터에 자동 배포
- **효과**
  - 코드 변경 시 빠른 피드백 및 일관된 릴리즈 파이프라인 확보할 수 있습니다.
  - 쿠버네티스 기반으로 **스케일링** 및 **롤링 배포** 가능할 수 있습니다.

## 인사이트

### 1. 신입 개발자로서 MSA 구조를 직접 경험해볼 수 있었던 기회

- NestJS 기반 모노레포 구조에서 실제로 **서비스를 분리**하고 각 서비스가 독립적으로 동작하도록 구성하면서 Gateway → Auth, Event 요청 흐름을 직접 구현하면서 MSA의 구조와 장단점을 실무 관점에서 체감할 수 있었습니다.

- MSA 아키텍처의 핵심인 **서비스 간 경계**, **공통 모듈 분리**를 적용하면서 단일 서비스보다 구조적 이해와 설계에 더 많은 고민이 필요하다는 점을 알게 되었습니다.

### 2. 확장성과 안정성을 고려한 설계의 중요성

- 이벤트 보상 시스템이라는 도메인은 수많은 유저 요청과 **비동기 이벤트 처리**가 필요한 구조였기 때문에 단순 구현을 넘어서 **트랜잭션 처리**, **조건부 인덱싱**, **에러 로깅**, **장애 복구 가능성**까지 고려한 설계가 필요했습니다.

- MongoDB의 트랜잭션과 Replica Set 설정, 보상 수량의 동시성 제어 등을 통해 **정합성**과 **일관성**을 유지하면서 동시에 확장 가능한 구조를 설계하는 경험을 할 수 있었습니다.

### 3. NestJS의 데코레이터, 가드, 역할 기반 접근 제어에 대한 실전 경험

- NestJS의 **`@Roles`, `@UseGuards`, `@CurrentUser()`** 같은 데코레이터 중심 구조는 복잡한 인증/인가 로직을 명확하게 분리하고 추상화하는 데 큰 도움이 되었습니다.

- 실제로 `JwtAuthGuard`, `RolesGuard`를 적용하여 유저,운영자,관리자 등 역할별 API 접근 제어를 구현하면서 NestJS의 **모듈성**과 **보안 처리 방식**을 이해할 수 있었습니다.
- 데코레이터 기반의 코드는 **가독성**과 **재사용성 측면**에서도 장점이 크다는 걸 실감했습니다.

## 소감

이번 프로젝트는 단순한 API 서버 구현을 넘어 NestJS 기반의 모노레포 + MSA 아키텍처를 직접 설계하고 운영하는 경험을 통해 개발자로서 한 단계 성장할 수 있는 값진 시간이었습니다.

단일 서비스가 아닌 여러 개의 독립적인 서비스를 다루는 구조였기 때문에 기능 단위 구현뿐 아니라 서비스 간 통신, 공통 모듈 분리, API 경계 설계 등 전체 시스템의 흐름을 고려한 개발이 필요했습니다. 특히 Gateway를 통한 API 라우팅과 인증(Auth), 이벤트(Event), 보상(Reward) 서비스 간의 역할을 명확히 나누고, 그에 따라 DTO, 에러 핸들링, 상태 관리 방식도 분리하면서 서비스 간 의존성을 최소화하는 설계에 집중했습니다.

또한 단순히 작동하는 기능을 구현하는 데 그치지 않고 왜 이 기술을 선택했는지 이 로직이 유지보수와 확장성에 어떤 영향을 주는지를 지속적으로 고민했습니다. 예를 들어 보상 요청 시 발생할 수 있는 트래픽 병목과 동시성 이슈를 고려해 MongoDB 트랜잭션을 적용하였고 `Replica Set` 환경에서 세션 기반 트랜잭션을 구성하며 데이터 무결성을 지켜내는 방식도 직접 설계해보았습니다.

기술 선택에 있어서도 단순히 익숙하거나 인기 있는 기술을 선택하는 것이 아니라, 현재의 요구사항과 추후의 확장 가능성, 팀 규모 등을 함께 고려하는 훈련을 할 수 있었습니다. 이는 곧 기능 개발에만 집중하는 것이 아닌 시스템 전체의 흐름과 운영을 바라보는 시야를 넓힐 수 있는 계기가 되었습니다.

실제 서비스를 운영한다는 가정하에 고민을 한다는 점에서 이벤트 조건 검증, 친구 초대 추천인 관리, 로그인 이력 저장 등 각각의 도메인이 실제 유저의 행동과 맞닿아 있음을 인식할 수 있었고 정확하고 신뢰할 수 있는 시스템을 설계해야 한다는 책임감을 느끼게 되었습니다.

이번 프로젝트는 단순히 NestJS를 활용한 서버 구축을 넘어서 서비스 아키텍처 설계, 기술 선택의 배경 설명, 장애 대응 구조 구성, 테스트 가능성 확보, 사용자 관점 설계까지 등 다양한 측면에서 고민하며 성장할 수 있었던 값진 경험이었다고 생각합니다.
