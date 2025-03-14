# Eva Case App

Bu proje, Eva Guru için geliştirilmiş bir vaka çalışmasıdır. Vue 3, TypeScript ve Tailwind CSS kullanılarak oluşturulmuştur.

## Özellikler

- Günlük satış verilerinin grafiksel gösterimi
- FBA ve FBM satışlarının karşılaştırmalı analizi
- SKU bazlı satış ve iade oranı takibi
- Tarih bazlı filtreleme ve karşılaştırma
- Responsive tasarım

## Teknolojiler

- Vue 3
- TypeScript
- Tailwind CSS
- Highcharts
- Vuex 4
- Vue Router

## Kurulum

```bash
# Bağımlılıkları yükleyin
npm install

# Geliştirme sunucusunu başlatın
npm run dev

# Projeyi derleyin
npm run build
```

## Kullanım

1. Giriş yapın
2. Grafik üzerinden tarih seçin
3. Seçilen tarihlere ait detaylı verileri tabloda görüntüleyin
4. İsterseniz iki farklı tarihi karşılaştırın

## Lisans

MIT

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) to make the TypeScript language service aware of `.vue` types.

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```
