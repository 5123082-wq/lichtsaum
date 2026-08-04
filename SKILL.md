---
name: build-chisel-google-first-landing
description: Build, review, or launch the CHISEL German illuminated-awning website across Stitch-to-code design, Next.js architecture, content, technical SEO, Google Ads measurement, Consent Mode v2, lead forms, accessibility, performance, and German compliance. Use for substantial implementation, audit, planning, or release work in this repository.
---

# Build CHISEL Google-First Landing

## Objective

Создавать немецкоязычный lead-generation сайт, который одновременно:

- точно следует утверждённой visual direction;
- имеет полезный server-rendered content;
- технически готов к Google Search и Google Ads;
- измеряет только валидные конверсии;
- уважает consent, privacy и accessibility;
- не публикует неподтверждённые claims.

Правила полномочий и безопасности находятся в `AGENTS.md` и не дублируются здесь.

## Context routing

Всегда начать с:

1. `PROGRESS.md` → `Context Beacon`.
2. `docs/README.md`.
3. Релевантный source of truth:
   - visual/UI → `DESIGN.md`;
   - architecture/forms/environments → `docs/architecture/system-architecture.md`;
   - public copy → `docs/content/content-strategy.md`;
   - claims → `docs/content/claims-and-evidence-register.md`;
   - indexing/metadata → `docs/seo/search-foundation.md`;
   - Schema → `docs/seo/structured-data.md`;
   - Ads → `docs/marketing/google-ads-readiness.md`;
   - events/conversions → `docs/marketing/measurement-plan.md`;
   - consent/data → `docs/legal/data-processing-and-consent.md`;
   - compliance → `docs/legal/compliance-plan.md`.

## Workflow

### 1. Establish verified state

- Прочитать существующий код и документы.
- Отделить `Verified`, `Decision`, `Proposed` и `TBD`.
- Для изменяемых внешних правил проверить актуальный официальный источник.

### 2. Define the outcome

- Сформулировать минимальный законченный результат.
- Назвать существенные допущения и stop conditions.
- Для каждого шага определить прямую проверку.

### 3. Protect shared facts

- Brand/company/contact facts брать из central config.
- Public claims сверять с claims register.
- Events брать из measurement plan.
- Schema генерировать из тех же подтверждённых данных, что видит пользователь.
- Не создавать параллельный источник истины.

### 4. Make the smallest coherent change

- Не добавлять speculative abstractions.
- Не менять соседний код без необходимости.
- Не ухудшать SEO, consent, accessibility, privacy и performance ради локальной визуальной
  простоты.
- Использовать Server Components/static rendering по умолчанию; добавлять client boundary
  только для реальной интерактивности.

### 5. Run domain gates

#### UI

- responsive 320–1920px;
- semantic landmarks и heading order;
- keyboard, focus, contrast, zoom, reduced motion;
- visual comparison with Stitch;
- no layout shift from media/fonts.

#### Content

- German-first, clear and specific;
- query/ad intent matches page;
- one primary CTA;
- no unverified claims, ratings, prices or proof;
- important content present in server HTML.

#### Search

- 200, indexable and crawlable;
- unique metadata and absolute self-canonical;
- canonical URL included in sitemap;
- production robots allows Googlebot and AdsBot;
- structured data matches visible content;
- Rich Results/Schema validation where applicable.

#### Ads and analytics

- final URL works with tracking parameters;
- no redirect/domain mismatch;
- Consent Mode signals precede tag behavior;
- no PII in analytics;
- `generate_lead` only after server success;
- one primary conversion and deduplicated `lead_id`;
- Tag Assistant/DebugView checks pass.

#### Form and security

- server-side validation;
- abuse protection and safe errors;
- persistence/CRM outcome verified;
- retry does not create uncontrolled duplicates;
- form works without analytics/marketing consent;
- no request body or contact data in logs.

#### Legal

- real business inputs only;
- consent categories match actual vendors;
- legal pages and processor list match deployment;
- claims and consumer UX reviewed where required;
- legal uncertainty is labelled, not guessed.

#### Performance

- LCP/INP/CLS targets are not regressed;
- client JS and third-party scripts are justified;
- LCP image is responsive and not lazy-loaded;
- fonts are local/subsetted.

### 6. Report

Сообщить:

- что изменено;
- какие проверки выполнены;
- какие assumptions/TBD остались;
- какие external/production действия не выполнялись.

Обновить `PROGRESS.md` только для material milestone.

## Stop conditions

Остановиться и запросить данные/разрешение, если работа требует:

- реальных company/legal/contact facts;
- неподтверждённого product claim;
- выбора или подключения CRM/CMP/vendor;
- production deployment или Ads publication;
- first-party data upload / Enhanced Conversions;
- irreversible external action.

## References

Execution principles are adapted and paraphrased from
`multica-ai/andrej-karpathy-skills`; exact revision and attribution are recorded in
`THIRD_PARTY_NOTICES.md`.
