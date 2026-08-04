# AGENT_THINKING_PROMPT.md

Этот файл задаёт рабочий чек-лист перед существенными изменениями. Он не требует публиковать
скрытую цепочку рассуждений. Наружу выводится только краткая сводка решений, допущений, рисков и
проверок.

Для очевидной мелкой правки использовать сокращённую версию. Для архитектуры, SEO, Ads,
аналитики, consent, формы, публичного текста и legal-sensitive UX пройти весь список.

## 1. Результат

- Какой конкретный наблюдаемый результат нужен пользователю?
- Что явно входит и не входит в задачу?
- Какой самый маленький законченный результат решает задачу?

## 2. Факты

Классифицировать важную информацию:

- `Verified` — подтверждено кодом, документом, Stitch или официальным источником.
- `Decision` — принято и записано в source of truth.
- `Proposed` — предложение, ещё не принятое.
- `TBD` — требует данных владельца или внешнего решения.

Не превращать `Proposed` и `TBD` в публичные факты.

## 3. Неоднозначность

- Есть ли несколько трактовок, которые существенно изменят результат?
- Можно ли безопасно продолжить с обратимым допущением?
- Требуется ли вопрос пользователю или новое разрешение?
- Есть ли более простое решение с тем же результатом?

## 4. Публичные утверждения

- Создаёт ли изменение claim о продукте, компании, цене, гарантии, сроке, географии,
  сертификации, отзыве или результате?
- Есть ли такой claim в `docs/content/claims-and-evidence-register.md`?
- Совпадает ли visible copy с Ads и Schema?

## 5. Google impact

Проверить, влияет ли задача на:

- HTTP status, crawlability или indexability;
- URL, canonical, redirect, sitemap или robots;
- title, description, heading hierarchy или internal links;
- structured data;
- mobile parity и server-rendered content;
- LCP, INP или CLS;
- AdsBot destination;
- event taxonomy, conversion deduplication или attribution;
- consent order и Google tag behavior;
- Search Console/Tag Assistant validation.

Если влияет — прочитать соответствующий документ в `docs/seo/` или `docs/marketing/`.

## 6. Privacy, legal и security

- Какие данные собираются, зачем и куда передаются?
- Не попадёт ли PII в URL, analytics, dataLayer или logs?
- Требуется ли consent, DPA или legal review?
- Сохраняется ли работа формы без marketing consent?
- Есть ли server-side validation, abuse protection и безопасная ошибка?
- Не создаётся ли внешний vendor/data flow без разрешения?

## 7. План и критерии готовности

Для каждого существенного шага записать кратко:

```text
Шаг → наблюдаемая проверка
```

Предпочитать прямую проверку: тест, build, response inspection, link check, Rich Results Test,
Tag Assistant, Lighthouse или browser verification.

## 8. Authority check

- Действие локальное и обратимое?
- Есть ли production/external write, публикация, расходы или удаление?
- Нужны ли реальные реквизиты, claims или vendor choice?

При нехватке полномочий остановиться до изменения внешнего состояния.

## 9. Краткий формат отчёта

```text
Понимание:
Verified:
Допущения/TBD:
Решение:
Риски:
Проверка:
Осталось:
```

Обновлять `PROGRESS.md` только для значимого milestone или изменения текущего направления.
