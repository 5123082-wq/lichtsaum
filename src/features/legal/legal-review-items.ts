export const legalReviewItems = {
  hostingAndLogs: {
    title: "Hosting и server logs",
    description:
      "Vercel Inc. выбран для hosting и Private Blob; текущий проект находится на Hobby, runtime logs доступны один час, а приложение не пишет содержимое формы в логи. Публичный DPA Vercel распространяет processor-условия на Pro и Enterprise, тогда как Hobby также ограничен личным некоммерческим использованием. До коммерческого production нужен совместимый тариф либо другой hosting."
  },
  productionFormAndFiles: {
    title: "Production-форма и загрузка файлов",
    description:
      "Форма, Neon metadata, Private Vercel Blob в регионе fra1, лимиты 5 × 15 МБ / 50 МБ, 90-дневное удаление и семидневные подписанные ссылки реализованы и локально проверены. Доступ предназначен только руководителю/уполномоченному обработчику заявки; пользователь предупреждён передавать только разрешённые проектные файлы. Перед production остаётся определить бесплатный механизм malware-проверки или отключить загрузку файлов."
  },
  recipientsAndTransfers: {
    title: "Получатели и передача в третьи страны",
    description:
      "Vendor register заполнен: Vercel Inc., Neon, LLC, Plus Five Five, Inc. (Resend), Cloudflare, Inc. и Google Ireland Limited; регионы, DPA, EU SCC и EU-US DPF описаны. Маркер остаётся только из-за отсутствия processor-покрытия Vercel Hobby для коммерческого production."
  },
  transportSecurity: {
    title: "HTTPS и техническая защита",
    description:
      "После настройки домена проверить принудительный HTTPS, TLS, security headers, доступ к файлам и журналирование. Только после фактической проверки заменить будущую формулировку на утверждение о production-системе."
  }
} as const;

export type LegalReviewItemId = keyof typeof legalReviewItems;

export const unresolvedLegalReviewItemIds = Object.keys(
  legalReviewItems
) as LegalReviewItemId[];
