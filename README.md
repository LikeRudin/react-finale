개발을 하면서 어떤 생각을했는지에 대한 기록은 post 폴더에 있습니다.

배포링크: https://react-finale-qz9unv3ni-shin-young-jins-projects.vercel.app/

배포 후 문제점: 여러 문제가 있습니다.
middleware.ts 내부에서 쿠키존재여부를 확인하는 방식으로 유저 로그인 확인 기능을 구현했습니다.
하지만 종종 작동하지 않습니다.
로그인시 페이지 자동이동이 작동하지 않을 경우, 사용자가 직접 URL을 변경하여 이동해야 합니다.

구체적인 코드 로직은 웹페이지에 쿠키가 두 개 이상 있으면 홈화면으로,
 그렇지 않으면 로그인 화면으로 자동 이동합니다.
하지만 앞에 언급한것처럼 배포 환경에서는 잘 작동하지 않는거같습니다.

또 Vercel은 middleware 호출 횟수에 따라 비용을 청구한다길래
추후 useUser와 같은 커스텀 훅으로 화면전환 로직을 다시 구현할 예정입니다.

로그인 화면 버그: 
login-in form 에서 입력한 이메일로 가입한 사용자가 존재하는지 
확인이 될 경우에만  password form을 보여주게되어있습니다,

그런데 어째서인지 그렇지 않아도 password form을 보여주고있습니다.

존재하지 않는 계정으로 login-in 시도시 password form으로 넘어가지 않아야 합니다.
로컬 버전에서는 정상적으로 작동하지만, 배포버전 버전 문제입니다


계정 생성 절차: 계정을 생성한 후, Network 탭에서 계정 생성 완료를 확인하시고, 페이지를 수동으로 '/' 로 이동해주시기 바랍니다.

사진 업로드 기능 관련 주의사항: 현재 'Edit Profile'에서만 사진 업로드 기능을 제공하고 있습니다.
하지만, 사진 업로드시 Cloud Flare로 수천발의 요청이 발사되고, 역시 제대로 작동하지 않습니다.


This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
