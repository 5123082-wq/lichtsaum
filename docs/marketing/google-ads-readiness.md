# Google Ads Readiness

Status: `Decision`; O10 account resources are configured locally, while business/release inputs
remain open user questions
Last reviewed: 2026-08-11

This file is a readiness/evidence checklist. Campaign publication follows
[`../architecture/publication-governance.md`](../architecture/publication-governance.md) and is
`Спросить у пользователя`; this checklist does not autonomously authorize or block it.

Этот файл задаёт выпускной шлюз для рекламной посадочной. Он не обещает одобрение Google Ads:
решение остаётся за Google и зависит также от объявления, аккаунта, продукта и фактического
бизнеса.

## Readiness outcome

Рекламный трафик можно направлять только на production URL, который:

- доступен без входа и стабильно отвечает `200`;
- одинаково полезен Googlebot, AdsBot-Google и посетителю;
- быстро работает на распространённых мобильных и desktop-устройствах;
- раскрывает реального поставщика, способ связи и условия предложения;
- соответствует intent объявления и ключевого слова;
- не содержит неподтверждённых преимуществ, цен, сроков, гарантий или отзывов;
- принимает заявку без обязательного analytics/marketing consent;
- измеряет подтверждённый лид без передачи персональных данных в аналитику.

## Destination requirements

| Check | Required result |
| --- | --- |
| Final URL | Один production HTTPS-домен; домен объявления совпадает с фактической посадочной |
| Availability | Нет auth, geo/IP block, broken redirect, 4xx/5xx или maintenance screen |
| Crawlability | AdsBot-Google может получить HTML, CSS, JS и изображения |
| Content | Полезный оригинальный немецкий контент, а не thin bridge page |
| Mobile | Основное содержание и CTA доступны без горизонтального скролла и навязчивых interstitials |
| Navigation | Рабочие контакты, `Impressum`, `Datenschutz` и consent settings доступны с посадочной |
| Form | Есть label, понятные обязательные поля, server validation, success/error states |
| Tracking params | `gclid`, `gbraid`, `wbraid` и UTM не ломают страницу, canonical или форму |
| Redirects | Нет цепочек, подмены домена, conditional content или cloaking |
| Browser behavior | Нет forced download, неожиданного приложения, pop-under или блокировки Back |

Preview/staging URL никогда не используется как Ads final URL.

## Ad-to-page contract

Для каждой ad group до запуска создать запись:

| Field | Meaning |
| --- | --- |
| Campaign / ad group | Владелец intent |
| Search intent | Задача пользователя, а не только строка keyword |
| Final URL | Каноническая посадочная |
| Ad promise | Что обещает объявление |
| Visible evidence | Где то же обещание доказано на странице |
| Primary CTA | Следующий ожидаемый шаг |
| Primary conversion | Только server-confirmed qualified-enough lead |
| Exclusions | Нерелевантные запросы/аудитории |
| Owner and review date | Кто подтвердил актуальность |

Правила:

- не отправлять разные intents на один общий экран, если предложение становится неясным;
- не повторять keyword механически в ущерб немецкому языку;
- не заявлять цену «ab …», скидку, бесплатность, срок или регион без записи `Approved` в
  claims register;
- не создавать doorway/city pages без уникальной услуги и реальной способности обслуживать
  указанную территорию;
- объявление, hero, CTA и форма должны описывать одну и ту же услугу.

## Conversion policy

- Единственная primary conversion для bidding в v1 — успешно принятая системой заявка.
- Plain, mini-configurator, full-configurator and calculator entry points share that same business
  conversion and lead intake under
  [`../architecture/unified-lead-form-contract.md`](../architecture/unified-lead-form-contract.md).
- Клик по кнопке, начало формы, просмотр thank-you page, телефонный или email-клик —
  diagnostic/secondary signals, не primary lead.
- `generate_lead` создаётся приложением после server success и получает неперсональный
  `lead_id`.
- Повторная отправка/refresh не должны создавать новый conversion для того же принятого лида.
- Direct Google Ads is the sole Primary conversion source. The sanitized GA4 `generate_lead` is
  not imported into Ads and must not duplicate the direct action.
- Enhanced Conversions выключены до отдельного privacy/legal решения и технической реализации
  через поддерживаемый Google канал.

Полный контракт событий находится в `measurement-plan.md`; unified form/context behavior — в
[`../architecture/unified-lead-form-contract.md`](../architecture/unified-lead-form-contract.md).

## Consent and privacy

- Consent defaults применяются до поведения Google tags.
- Поддерживаются `analytics_storage`, `ad_storage`, `ad_user_data` и `ad_personalization`.
- Посетитель может отклонить, выбрать категории и позднее изменить решение.
- Отказ от marketing/analytics не блокирует контент, навигацию или форму.
- Контактные данные, свободный текст и точный адрес не попадают в URL, GTM/GA4 events или
  рекламные параметры.
- Фактический Basic/Advanced Consent Mode и выбранный CMP должны совпадать с
  `../legal/data-processing-and-consent.md` и опубликованной privacy information.

## Campaign-input readiness

До первой кампании бизнес-владелец подтверждает:

- юридическое лицо/предпринимателя и публичные контакты;
- точную продуктовую категорию и доступные конфигурации;
- реальную географию обслуживания;
- процесс обработки заявки и рабочее время ответа;
- доказательства всех рекламных claims;
- commercial model: quote only, prices, VAT and installation conditions;
- policy-sensitive ограничения продукта, если они обнаружатся;
- Ads account ownership, billing, access and conversion owner.

## Pre-launch verification

### Destination

- [ ] Final URL и все legal/contact links отвечают корректно.
- [ ] Googlebot/AdsBot не заблокированы firewall, robots или bot protection.
- [ ] URL работает с realistic tracking parameters.
- [ ] Mobile form проходит от открытия до подтверждения.
- [ ] Нет production secret/test IDs, preview canonical или `noindex`.

### Message and trust

- [ ] Keyword/ad/landing intent совпадают.
- [ ] Все claims имеют статус `Approved`.
- [ ] Provider, contact, privacy and consent information фактические.
- [ ] Нет fake scarcity, preselected marketing consent или misleading CTA.

### Measurement

- [ ] Consent states проверены через Tag Assistant.
- [ ] DebugView получает только разрешённые параметры.
- [ ] Test lead создаёт ровно один primary conversion.
- [ ] Invalid/rejected lead не создаёт conversion.
- [ ] Повтор/refresh не дублирует conversion.
- [ ] GA4 и Ads не считают один lead двумя primary actions.

### Performance and accessibility

- [ ] Mobile Core Web Vitals budget проверен на production-like сборке.
- [ ] Keyboard, focus, zoom, contrast и error announcement проверены.
- [ ] Third-party tags не блокируют hero/form и не создают заметный layout shift.

## Release evidence

Сохранить в release record:

- timestamp и production URL;
- screenshot/version рекламного promise и landing hero;
- результаты URL/status/canonical/robots checks;
- Tag Assistant/DebugView evidence без PII;
- test `lead_id` и доказательство deduplication;
- claim approvals;
- список известных ограничений и владельцев.

## Official references

- [Google Ads destination requirements](https://support.google.com/adspolicy/answer/6368661?hl=en-GB)
- [Consent Mode for websites and apps](https://support.google.com/google-ads/answer/13695607?hl=en)
- [Google Tag Manager consent support](https://support.google.com/tagmanager/answer/10718549?hl=en)
- [Google Analytics policy on personally identifiable information](https://support.google.com/analytics/answer/6366371?hl=en)
- [Google Ads enhanced conversions](https://support.google.com/google-ads/answer/15712870?hl=en-0)
