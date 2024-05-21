# [2.10.0](https://github.com/Pulsifi/notification-fn/compare/v2.9.0...v2.10.0) (2024-03-20)

### Features

-   **program:** add program invite and result ready domain events ([#106](https://github.com/Pulsifi/notification-fn/issues/106)) ([7e4b122](https://github.com/Pulsifi/notification-fn/commit/7e4b122536e73d5281ce9118d24c8b777fc8ef7b))

# [2.9.0](https://github.com/Pulsifi/notification-fn/compare/v2.8.0...v2.9.0) (2024-03-01)

### Features

-   **sendemail:** send email with sender email config and remove reply address ([#103](https://github.com/Pulsifi/notification-fn/issues/103)) ([57119d6](https://github.com/Pulsifi/notification-fn/commit/57119d61ca86923973d718b1e09fcbd35479616f))

# [2.8.0](https://github.com/Pulsifi/notification-fn/compare/v2.7.4...v2.8.0) (2024-02-26)

### Features

-   **runtime:** upgrade runtime and workflow to node20 ([#101](https://github.com/Pulsifi/notification-fn/issues/101)) ([f58a6dc](https://github.com/Pulsifi/notification-fn/commit/f58a6dc9724201051834767e160f5b09a3f695f8))

## [2.7.4](https://github.com/Pulsifi/notification-fn/compare/v2.7.3...v2.7.4) (2024-02-19)

### Bug Fixes

-   **metrics:** remove sns tracking event ([#100](https://github.com/Pulsifi/notification-fn/issues/100)) ([0b1a2d6](https://github.com/Pulsifi/notification-fn/commit/0b1a2d67e329713ca6333f07ecab470fbd149b17))

## [2.7.3](https://github.com/Pulsifi/notification-fn/compare/v2.7.2...v2.7.3) (2024-01-17)

### Bug Fixes

-   **reminder:** reviewee submission due reminder sent instead of reviewer submission due reminder ([#97](https://github.com/Pulsifi/notification-fn/issues/97)) ([afdb49f](https://github.com/Pulsifi/notification-fn/commit/afdb49f03e6722e866d2d95f85057cf7c27e9e68))

## [2.7.2](https://github.com/Pulsifi/notification-fn/compare/v2.7.1...v2.7.2) (2023-10-11)

### Bug Fixes

-   **recommendation:** update email template type ([#94](https://github.com/Pulsifi/notification-fn/issues/94)) ([4092a0f](https://github.com/Pulsifi/notification-fn/commit/4092a0f28b2241395cca217ba7eab487b241da2c))

## [2.7.1](https://github.com/Pulsifi/notification-fn/compare/v2.7.0...v2.7.1) (2023-10-10)

### Bug Fixes

-   use basic FeedbackEvent interface ([#93](https://github.com/Pulsifi/notification-fn/issues/93)) ([e824a8b](https://github.com/Pulsifi/notification-fn/commit/e824a8b446e6d7ae442abdde3adf6e0608ee78af))

# [2.7.0](https://github.com/Pulsifi/notification-fn/compare/v2.6.0...v2.7.0) (2023-10-02)

### Features

-   add employee feedback recommendation completed event ([#91](https://github.com/Pulsifi/notification-fn/issues/91)) ([020d80c](https://github.com/Pulsifi/notification-fn/commit/020d80cb5b7a634257b5969325b686cc4d5c1230))

# [2.6.0](https://github.com/Pulsifi/notification-fn/compare/v2.5.0...v2.6.0) (2023-09-06)

### Features

-   **send-email:** add a validation make sure any link/url pass in should be valid ([#90](https://github.com/Pulsifi/notification-fn/issues/90)) ([b121ce9](https://github.com/Pulsifi/notification-fn/commit/b121ce9a29dc172a31e1747336c93a05484ac333))

# [2.5.0](https://github.com/Pulsifi/notification-fn/compare/v2.4.0...v2.5.0) (2023-08-25)

### Features

-   **push_notification:** only send push notifications if user_account_id > 0 ([#89](https://github.com/Pulsifi/notification-fn/issues/89)) ([be5c03a](https://github.com/Pulsifi/notification-fn/commit/be5c03ac002003c3cfd553173cbd4c7433926a7f))

# [2.4.0](https://github.com/Pulsifi/notification-fn/compare/v2.3.3...v2.4.0) (2023-08-09)

### Features

-   **employee-assignment:** added company name in EmployeeAssignmentEvent ([#86](https://github.com/Pulsifi/notification-fn/issues/86)) ([870f069](https://github.com/Pulsifi/notification-fn/commit/870f069e6cf9d23c39d391fec4027bf47fbbe973))

## [2.3.3](https://github.com/Pulsifi/notification-fn/compare/v2.3.2...v2.3.3) (2023-07-11)

### Bug Fixes

-   to utilize email template if exist when preparing email request ([#82](https://github.com/Pulsifi/notification-fn/issues/82)) ([c4f6cae](https://github.com/Pulsifi/notification-fn/commit/c4f6caef819537ee2b0906f343856d46e0697c9f))

## [2.3.2](https://github.com/Pulsifi/notification-fn/compare/v2.3.1...v2.3.2) (2023-07-06)

### Bug Fixes

-   **failure-code:** fix EmailActivityMessageFailureCode enum ([#81](https://github.com/Pulsifi/notification-fn/issues/81)) ([81891a4](https://github.com/Pulsifi/notification-fn/commit/81891a41c85a702ee5a4db05d2a859a71967164a))

## [2.3.1](https://github.com/Pulsifi/notification-fn/compare/v2.3.0...v2.3.1) (2023-06-30)

### Bug Fixes

-   **sendername:** add rfc20477 encode ([#80](https://github.com/Pulsifi/notification-fn/issues/80)) ([34f61f6](https://github.com/Pulsifi/notification-fn/commit/34f61f60c245d6e2f46a6d22e9c80745ecb35af4))

# [2.3.0](https://github.com/Pulsifi/notification-fn/compare/v2.2.2...v2.3.0) (2023-06-06)

### Features

-   **adminamendment:** add admin amendment message ([#79](https://github.com/Pulsifi/notification-fn/issues/79)) ([a6cdc74](https://github.com/Pulsifi/notification-fn/commit/a6cdc749984dc7044fe5292e8758e01812ec440c))

## [2.2.2](https://github.com/Pulsifi/notification-fn/compare/v2.2.1...v2.2.2) (2023-05-26)

### Bug Fixes

-   **feedback:** resolve missing company id in email request and feedback interface ([#78](https://github.com/Pulsifi/notification-fn/issues/78)) ([d5aff0c](https://github.com/Pulsifi/notification-fn/commit/d5aff0cde91e7a8c5117edcc1ba3b111fb14e7a4))

## [2.2.1](https://github.com/Pulsifi/notification-fn/compare/v2.2.0...v2.2.1) (2023-05-12)

### Bug Fixes

-   **feedback:** update event typo ([#76](https://github.com/Pulsifi/notification-fn/issues/76)) ([76f50bc](https://github.com/Pulsifi/notification-fn/commit/76f50bc1685ec0550aa2f482e78696ef3076d681))

# [2.2.0](https://github.com/Pulsifi/notification-fn/compare/v2.1.2...v2.2.0) (2023-05-12)

### Features

-   **feedback:** send in-app message and email ([#74](https://github.com/Pulsifi/notification-fn/issues/74)) ([cd55807](https://github.com/Pulsifi/notification-fn/commit/cd5580739091480ffce811c782c8a76b231c8a52))

## [2.1.2](https://github.com/Pulsifi/notification-fn/compare/v2.1.1...v2.1.2) (2023-03-13)

### Bug Fixes

-   incorrect base path ([#72](https://github.com/Pulsifi/notification-fn/issues/72)) ([36f99c1](https://github.com/Pulsifi/notification-fn/commit/36f99c1a8a9e729937044636ce3395c2d0fd33ff))

## [2.1.1](https://github.com/Pulsifi/notification-fn/compare/v2.1.0...v2.1.1) (2023-03-10)

### Bug Fixes

-   missing aws config variable in provider level ([#71](https://github.com/Pulsifi/notification-fn/issues/71)) ([7aaf688](https://github.com/Pulsifi/notification-fn/commit/7aaf68886460cd1371a53b31a7fddd04975f0f08))

# [2.1.0](https://github.com/Pulsifi/notification-fn/compare/v2.0.0...v2.1.0) (2023-03-08)

### Features

-   add locale functionality ([#70](https://github.com/Pulsifi/notification-fn/issues/70)) ([b2de97e](https://github.com/Pulsifi/notification-fn/commit/b2de97e6d9b9be63741e7599d9da1bc24e9f1311))

# [2.0.0](https://github.com/Pulsifi/notification-fn/compare/v1.15.0...v2.0.0) (2023-03-01)

### Features

-   update to use fn-lib ([#69](https://github.com/Pulsifi/notification-fn/issues/69)) ([a559947](https://github.com/Pulsifi/notification-fn/commit/a55994746582878220c917c67ca14df425f7b318))

### BREAKING CHANGES

-   update to use fn-lib

https://pulsifi.atlassian.net/browse/CHAR-3514

# [1.15.0](https://github.com/Pulsifi/notification-fn/compare/v1.14.1...v1.15.0) (2023-02-22)

### Features

-   update npm packages ([#68](https://github.com/Pulsifi/notification-fn/issues/68)) ([6f1fb9a](https://github.com/Pulsifi/notification-fn/commit/6f1fb9ad82a9fa7f9dd740c63fb28f39f966e377))

## [1.14.1](https://github.com/Pulsifi/notification-fn/compare/v1.14.0...v1.14.1) (2023-02-14)

### Bug Fixes

-   **ci:** refactor gh action workflows ([#67](https://github.com/Pulsifi/notification-fn/issues/67)) ([3598aac](https://github.com/Pulsifi/notification-fn/commit/3598aac22672d8609e3d940c400a3be1ccde89f6))

# [1.14.0](https://github.com/Pulsifi/notification-fn/compare/v1.13.0...v1.14.0) (2023-02-10)

### Bug Fixes

-   **manager-report:** fix test still affected by date ([#65](https://github.com/Pulsifi/notification-fn/issues/65)) ([6bf00a6](https://github.com/Pulsifi/notification-fn/commit/6bf00a6ba5da6b3b2fbc69eaaa856bc30cf0725e))
-   **manager-report:** refactor test to use mock date instead ([#66](https://github.com/Pulsifi/notification-fn/issues/66)) ([cad3fed](https://github.com/Pulsifi/notification-fn/commit/cad3fede28a3a0dfa1527b99f244ca2aa21022d1))

### Features

-   **manager-report:** send manager report email feature ([#60](https://github.com/Pulsifi/notification-fn/issues/60)) ([e175c79](https://github.com/Pulsifi/notification-fn/commit/e175c799166c38596b42984e2806a96e1e90a818))

# [1.13.0](https://github.com/Pulsifi/notification-fn/compare/v1.12.0...v1.13.0) (2023-01-30)

### Features

-   **sentry:** add aws_region sentry tag ([#59](https://github.com/Pulsifi/notification-fn/issues/59)) ([17087c9](https://github.com/Pulsifi/notification-fn/commit/17087c993657a50dd928ad1864c171fd86edea87))

# [1.12.0](https://github.com/Pulsifi/notification-fn/compare/v1.11.0...v1.12.0) (2023-01-06)

### Features

-   **file_name:** add file_name into template variable ([#57](https://github.com/Pulsifi/notification-fn/issues/57)) ([e973565](https://github.com/Pulsifi/notification-fn/commit/e9735654fef12f3b371e68c1ae1a07c2bad4040b))
-   **notification:** support assignment related notifications ([#58](https://github.com/Pulsifi/notification-fn/issues/58)) ([bc10990](https://github.com/Pulsifi/notification-fn/commit/bc10990bc75537d86fe2062031a1e87329c800a1))

# [1.11.0](https://github.com/Pulsifi/notification-fn/compare/v1.10.0...v1.11.0) (2022-12-09)

### Features

-   **email:** getEmailTemplate unit test ([#48](https://github.com/Pulsifi/notification-fn/issues/48)) ([e046104](https://github.com/Pulsifi/notification-fn/commit/e046104831379669f96b476a2b2080a4cc51b2d3))
-   **notification:** add employee assignment deleted email notification ([#54](https://github.com/Pulsifi/notification-fn/issues/54)) ([b6aab60](https://github.com/Pulsifi/notification-fn/commit/b6aab602336415179af8ef2acf8ea762929d60b5))
-   **notification:** add employee assignment updated email notification ([#51](https://github.com/Pulsifi/notification-fn/issues/51)) ([5ea81fd](https://github.com/Pulsifi/notification-fn/commit/5ea81fd096937180de0fbcfa59b59e4a16a8e4f7))
-   **notification:** add goal or task completion email notification ([#50](https://github.com/Pulsifi/notification-fn/issues/50)) ([0f6e59c](https://github.com/Pulsifi/notification-fn/commit/0f6e59c789d5b2818896dd08b72336af94884545))
-   **notification:** base push notification feature ([#45](https://github.com/Pulsifi/notification-fn/issues/45)) ([776ef7a](https://github.com/Pulsifi/notification-fn/commit/776ef7a9cd251f392f3398d7bf079a2429debbd5))
-   **notification:** send push notification for due notification ([#52](https://github.com/Pulsifi/notification-fn/issues/52)) ([e855b2c](https://github.com/Pulsifi/notification-fn/commit/e855b2cd11d309ae06bffe8bbadda54c61b7adec))

# [1.10.0](https://github.com/Pulsifi/notification-fn/compare/v1.9.1...v1.10.0) (2022-11-25)

### Features

-   **notification:** add employee reminder notification process ([#46](https://github.com/Pulsifi/notification-fn/issues/46)) ([4344db6](https://github.com/Pulsifi/notification-fn/commit/4344db6843db4ab3a5cecb8a5e7bedf2cb85194d))

## [1.9.1](https://github.com/Pulsifi/notification-fn/compare/v1.9.0...v1.9.1) (2022-11-24)

### Bug Fixes

-   **email:** handle getEmailTemplate ([#47](https://github.com/Pulsifi/notification-fn/issues/47)) ([d794087](https://github.com/Pulsifi/notification-fn/commit/d794087caef3e23866b145969ed8aaa5850fc059))

# [1.9.0](https://github.com/Pulsifi/notification-fn/compare/v1.8.0...v1.9.0) (2022-11-11)

### Features

-   **notification:** add assignment email notification ([#43](https://github.com/Pulsifi/notification-fn/issues/43)) ([8dbc9bc](https://github.com/Pulsifi/notification-fn/commit/8dbc9bcbb4d5e7d0a91587b449e890c8f86c8254))

# [1.8.0](https://github.com/Pulsifi/notification-fn/compare/v1.7.1...v1.8.0) (2022-10-31)

### Features

-   add new metric tracking ([#42](https://github.com/Pulsifi/notification-fn/issues/42)) ([1cc56a8](https://github.com/Pulsifi/notification-fn/commit/1cc56a8b53a93b49a7e82f73c570ee119246f54a))

## [1.7.1](https://github.com/Pulsifi/notification-fn/compare/v1.7.0...v1.7.1) (2022-10-03)

### Bug Fixes

-   **ses:** add retry when send ses email and remove silent exception ([#41](https://github.com/Pulsifi/notification-fn/issues/41)) ([afe9de0](https://github.com/Pulsifi/notification-fn/commit/afe9de06aee6889c24b0e6c7c340064d1120541a))

# [1.7.0](https://github.com/Pulsifi/notification-fn/compare/v1.6.1...v1.7.0) (2022-06-28)

### Bug Fixes

-   add aws assumed role ([4762e8b](https://github.com/Pulsifi/notification-fn/commit/4762e8b6bfa27d8aea155c15ca8dfebe606cbcbe))
-   add log retention setting and update npm ([56586b7](https://github.com/Pulsifi/notification-fn/commit/56586b7b529c5240b05bfcc4e491fe2e7689dcf4))
-   update eslint rules and refactor ([#39](https://github.com/Pulsifi/notification-fn/issues/39)) ([b20820a](https://github.com/Pulsifi/notification-fn/commit/b20820a26c2aa8f8a51842a62be648f0c51615b7))

### Features

-   add gh action cicd workflows ([#38](https://github.com/Pulsifi/notification-fn/issues/38)) ([90f4b5c](https://github.com/Pulsifi/notification-fn/commit/90f4b5c04c6a45239d841c4bed0316064ccbe9bd))

## [1.6.1](https://github.com/Pulsifi/notification-fn/compare/v1.6.0...v1.6.1) (2022-06-10)

### Bug Fixes

-   **sentry:** resolve http 429 ([96167fd](https://github.com/Pulsifi/notification-fn/commit/96167fd9082f0730e9b235b03e7f70a5a21289fe))

# [1.6.0](https://github.com/Pulsifi/notification-fn/compare/v1.5.0...v1.6.0) (2022-02-09)

### Features

-   **logger:** logger undefined ([fea0aef](https://github.com/Pulsifi/notification-fn/commit/fea0aefd60a538b565d67963e34d415534c936a7))

# [1.5.0](https://github.com/Pulsifi/notification-fn/compare/v1.4.0...v1.5.0) (2022-01-28)

### Features

-   **send-email:** add default year variable when parse email template ([622617a](https://github.com/Pulsifi/notification-fn/commit/622617abae3e7f682689a4022971388f1e524423))

# [1.4.0](https://github.com/Pulsifi/notification-fn/compare/v1.3.0...v1.4.0) (2022-01-20)

### Features

-   **timeout:** increase timeout ([0492d97](https://github.com/Pulsifi/notification-fn/commit/0492d97f74463bfb28821b030ffb3d3f09983a70))

# [1.3.0](https://github.com/Pulsifi/notification-fn/compare/v1.2.0...v1.3.0) (2022-01-20)

### Features

-   **timeout:** increase timeout to 30s ([cb5aa88](https://github.com/Pulsifi/notification-fn/commit/cb5aa88e3934835ade7247ef9d53b8883efcd973))

# [1.2.0](https://github.com/Pulsifi/notification-fn/compare/v1.1.0...v1.2.0) (2022-01-20)

### Features

-   **timeout:** adjust timeout ([beda962](https://github.com/Pulsifi/notification-fn/commit/beda96233a4c2b91fc149077fcd11de824e13be9))

# [1.1.0](https://github.com/Pulsifi/notification-fn/compare/v1.0.0...v1.1.0) (2022-01-20)

### Features

-   **timeout:** increase timeout ([e328bed](https://github.com/Pulsifi/notification-fn/commit/e328bedbe9c0951c48776ee9712310b7a1b7a012))

# 1.0.0 (2022-01-20)

### Bug Fixes

-   **build:** fix lint ([fa7f1d0](https://github.com/Pulsifi/notification-fn/commit/fa7f1d0863821a566cee76fab8a0ac5a43757c24))
-   **build:** undo pusher utils ([de127a1](https://github.com/Pulsifi/notification-fn/commit/de127a103a4f32b3eb53d1eb8960cbfbc76d63ee))
-   **dependencies:** fix aws sdk dependencies ([f6084f6](https://github.com/Pulsifi/notification-fn/commit/f6084f6d8eb0bb02cf97095c8384ddce92442465))
-   **emailtemplate:** replace system/default boolean with usage enum ([027994a](https://github.com/Pulsifi/notification-fn/commit/027994a1e51a5321549e63c2105ff068a28c7446))
-   **emailtemplate:** update email communication type enum ([c488b92](https://github.com/Pulsifi/notification-fn/commit/c488b923e0af49b3c7387f7dddb537e7783f9136))
-   **getEmailTemplate:** get by email comminication type with companyid ([8bb9c47](https://github.com/Pulsifi/notification-fn/commit/8bb9c47f562378ccd95005f3a6d7108565685643))
-   **logger:** add withrequest method ([0277471](https://github.com/Pulsifi/notification-fn/commit/0277471e1eaf37472d7be9b7eab57666c9d113a3))
-   **middy-ssm:** log ssm env variable ([935a30e](https://github.com/Pulsifi/notification-fn/commit/935a30e19e7bf5a4afeafc4c6790e00d7f6ca91b))
-   **pusher:** add chunk array by length before send notification ([f754647](https://github.com/Pulsifi/notification-fn/commit/f75464788369cfb5f3c41f373027b3279285d092))
-   **secretmanager:** move to devdependencies ([b61f489](https://github.com/Pulsifi/notification-fn/commit/b61f4894973960f9bbc46bc81895ea8bf25a7894))
-   **send-email:** store failture message as json format ([2c81148](https://github.com/Pulsifi/notification-fn/commit/2c8114820be34b81648d7723936edacf5a008ad4))
-   **serverless:** update ssm env key ([596c939](https://github.com/Pulsifi/notification-fn/commit/596c939658feb8eecb48acaa3c8d6e54d79bc793))
-   **ssm:** disabled ssm ([c7d5990](https://github.com/Pulsifi/notification-fn/commit/c7d5990ca887b89c217b871826d874e35a7897d9))
-   **ssm:** revert ssm ([0686bf7](https://github.com/Pulsifi/notification-fn/commit/0686bf74b77343b4ff2c975ae87f095d7c28bf29))
-   **test:** add expect to unit test ([9b13b45](https://github.com/Pulsifi/notification-fn/commit/9b13b45aec411913504ea5f6b8ca465f6f5d97d5))
-   **test:** add process event message test ([787ee5d](https://github.com/Pulsifi/notification-fn/commit/787ee5d8a000514c1ec9c92933735a1994739d66))
-   **typeorm:** remove enum on email recipient group ([b680ba9](https://github.com/Pulsifi/notification-fn/commit/b680ba9d17dd2e1dd9b14ce9f62e37d524d1e39a))

### Features

-   **aws-sdk:** replace aws sdk with v3 client and remove aws-sdk-mock ([5088c60](https://github.com/Pulsifi/notification-fn/commit/5088c60a583039fc3efc737245843e40b67006e1))
-   **email:** add system user enum and save email sent_at timestmap ([46a5f46](https://github.com/Pulsifi/notification-fn/commit/46a5f468bfdf3ee6f52d76f094417acaf6e43c9e))
-   **email:** no permission issue temp fix ([f1e2868](https://github.com/Pulsifi/notification-fn/commit/f1e2868e6f2b3aeda8d7af6f33d1ba4269d516d0))
-   **email:** no permission issue temp fix ([a759415](https://github.com/Pulsifi/notification-fn/commit/a759415fcb9224a2cf99348cda7fda1067d71935))
-   **logger:** refactor logger utils ([3a095b7](https://github.com/Pulsifi/notification-fn/commit/3a095b7016090b82cce391c4cd7bcf211b9bedd0))
-   **logger:** refactor pino logger to utils ([a3fcd2c](https://github.com/Pulsifi/notification-fn/commit/a3fcd2c8e72fa04896661cd5f71907d2aae4d61a))
-   **pushnotification:** add app notifcation template for push notifcation service ([b80df86](https://github.com/Pulsifi/notification-fn/commit/b80df8647358fbc17f3fc0f0324b1004d73ebab0))
