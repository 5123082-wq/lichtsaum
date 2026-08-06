export const legalReviewItems = {
  hostingAndLogs: {
    title: "Hosting и server logs",
    description:
      "Vercel Inc. выбран для hosting и Private Blob; production deployment и собственный домен активны, runtime logs доступны один час, а приложение не пишет содержимое формы в логи."
  },
  productionFormAndFiles: {
    title: "Production-форма и загрузка файлов",
    description:
      "Форма, Neon metadata, Private Vercel Blob в регионе fra1, лимиты 5 × 15 МБ / 50 МБ, 90-дневное удаление и семидневные подписанные ссылки реализованы и локально проверены. Доступ предназначен только руководителю/уполномоченному обработчику заявки; пользователь предупреждён передавать только разрешённые проектные файлы. Перед production остаётся определить бесплатный механизм malware-проверки или отключить загрузку файлов."
  },
  recipientsAndTransfers: {
    title: "Получатели и передача в третьи страны",
    description:
      "Vendor register заполнен: Vercel Inc., Neon, LLC, Plus Five Five, Inc. (Resend), Cloudflare, Inc. и Google Ireland Limited; регионы и механизмы международной передачи описаны."
  },
  transportSecurity: {
    title: "HTTPS и техническая защита",
    description:
      "Production-домен принудительно использует HTTPS; HSTS, nosniff, frame denial, referrer и permissions headers проверены на публичном ответе."
  }
} as const;

export type LegalReviewItemId = keyof typeof legalReviewItems;

export const unresolvedLegalReviewItemIds = Object.keys(
  legalReviewItems
) as LegalReviewItemId[];
