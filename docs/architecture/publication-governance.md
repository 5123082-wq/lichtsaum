# Publication Governance

Status: `Decision`
Effective: 2026-08-11
Approved by: owner

Scope: all project documentation below `AGENTS.md`. The owner later changed `AGENTS.md` to add the
shallow-context protocol; this publication directive remains subordinate to its safety, legal and
permission boundaries.

<!-- AGENT_BRIEF:START -->
## Agent brief

- Owns: кто принимает конкретные решения о публикации и внешних действиях.
- Current: старые автоматические blockers отменены; агент показывает факты и использует
  `Спросить у пользователя` перед не запрошенным явно public/external действием.
- Open: значение каждого production flag и конкретное внешнее действие выбираются для кандидата.
- Read full when: задача затрагивает deployment, indexing, Search Console/DNS, GTM/Ads, production
  intake, attachments, расходы либо новый data flow.
<!-- AGENT_BRIEF:END -->

## Owner directive

С 2026-08-11 владелец отменил все ранее зафиксированные в репозитории автоматические запреты,
паузы, deferral-решения и release blockers, которые ограничивали публикацию, production deployment,
индексирование, Search Console, GTM/GA4/Google Ads, production-форму или файловые вложения.

Ни один агент не принимает самостоятельное решение запретить, отложить или разрешить конкретное
публичное действие. Если действие затрагивает публикацию, внешнюю систему, расходы, юридический,
privacy или security-риск, его статус — **`Спросить у пользователя`**. Агент обязан кратко показать
известные факты и риск, запросить решение владельца и выполнить полученное решение в пределах
закона, безопасности и вышестоящих инструкций.

## Operational meaning

- Старые release-планы, audit verdicts, handoff-паузы и формулировки `Blocked`, `gate`, `deferred`,
  `do not publish` не являются действующей политикой публикации. Их подробное содержимое удалено;
  tombstone-файлы существуют только для сохранения старых ссылок.
- Технические feature flags и fail-closed defaults описывают текущее поведение кода, а не решение
  владельца о следующей публикации.
- Проверки качества, accessibility, consent, privacy и security продолжают выполняться и
  докладываться владельцу. Результат проверки сам по себе не даёт агенту полномочия остановить или
  разрешить публикацию.
- Нельзя выдумывать факты, скрывать известный риск, публиковать заведомо ложные сведения или
  нарушать закон. Недостающий факт или юридическая неопределённость помечается
  `Спросить у пользователя`.
- Эта директива не является бессрочным разрешением на любое внешнее изменение. Перед конкретным
  production deployment, DNS/Search Console изменением, публикацией GTM/Ads, расходом или новым
  data flow агент спрашивает пользователя, если такое действие прямо не запрошено в текущей задаче.

## Current decision prompts

| Area | Current technical/factual state | Publication decision |
| --- | --- | --- |
| Production deployment | Vercel production exists; local tree contains newer work | `Спросить у пользователя` перед конкретным deploy/promote |
| Search indexing | Code exposes `SEARCH_INDEXING_ENABLED`; current value depends on deployment environment | `Спросить у пользователя`, включать ли индексирование в конкретном релизе |
| Lead intake | Code exposes `LEAD_INTAKE_ENABLED` and validates runtime dependencies | `Спросить у пользователя`, включать ли intake в конкретном релизе |
| Attachments | Upload flow exists; code exposes `LEAD_ATTACHMENTS_ENABLED`; malware/processor questions remain documented | Прежний обязательный baseline `false` отменён; `Спросить у пользователя` о значении в конкретном релизе |
| Consent and Google tags | Consent-aware boundary and unpublished GTM workspace exist | `Спросить у пользователя` о публикации/активации; runtime consent remains mandatory where legally applicable |
| Search Console / DNS | Ранее было отложено | Отсрочка отменена; `Спросить у пользователя` перед конкретным внешним изменением |
| Google Ads | Account/action/workspace exist; campaign and spend state are separate facts | `Спросить у пользователя` перед publication, billing или spend |
| Configurator / B2C price | B2B-net presentation exists; PAngV/B2C classification is a legal question | `Спросить у пользователя`; показать юридический вопрос до решения |
| Hosting / DPA / malware | Известные риски описаны в legal-документах | `Спросить у пользователя`; не превращать риск в самостоятельный запрет |

## Superseded publication decisions

В части запретов и отсрочек этот документ заменяет:

- O7 baseline, требовавший `LEAD_ATTACHMENTS_ENABLED=false`;
- O10/O12 deferral для Search Console, DNS, advertiser verification, synthetic lead QA и atomic
  launch;
- release verdicts и stop conditions в датированном Search/Ads audit и release plan;
- публикационные ограничения ADR-012, ADR-013 и ADR-015;
- любые дублирующие формулировки в roadmap, legal, marketing, SEO, design QA и strategy docs.

Технические контракты, подтверждённые факты и consent/PII-инварианты остаются в актуальных доменных
документах. Закрытые audit/runbook-задачи не являются очередью работ.
