# Exame Psicotécnico: Treino CNH

App Android (Expo) de treino para o exame psicotécnico da CNH.

## Anúncios

Todo build usa os IDs de teste do Google AdMob, a menos que `EXPO_PUBLIC_ADS=production`
esteja definido na hora do bundle. Só o build que vai para a loja leva essa variável:

- EAS: o perfil `production` do `eas.json` já define.
- Gradle local: `EXPO_PUBLIC_ADS=production ./gradlew bundleRelease` dentro de `android/`.

Builds de validação (emulador, aparelho de teste) nunca devem ter a variável.

## Desenvolvimento

```sh
npm ci
npm run typecheck
npm test
```
