# Taiwan Organic Agriculture Map

> **iGEM Software Submission notice:** this repository (`main` branch) hosts the full source
> code of our team's software tool for the **Software & AI** village / **Best Software** award.
> A [release](https://docs.gitlab.com/ee/user/project/releases/) will be automatically created
> at the Wiki Freeze as the judging artifact. See the
> [Software Project](https://teams.igem.org/go/deliverables/software) page for full requirements.
>
> **Using an AI assistant (e.g. Claude Code)?** Please read
> [.claude/RESPONSIBLE_AI_USE.md](.claude/RESPONSIBLE_AI_USE.md) first. You remain fully
> responsible for everything you commit: don't misrepresent what your tool does, never commit
> secrets, and review every change.

Taiwan Organic Agriculture Map (CCU-iGEM-organic) is a more user-friendly search platform built on top of Taiwan's official organic / eco-friendly farming operator API, helping the public easily find organic and eco-friendly farming sellers across Taiwan.

**Live demo:** https://igem.xn--hrr.tw/

## Overview

- **Browse by image:** Produce is grouped into 7 categories — rice, grains/legumes, specialty crops, vegetables, fruit, processed agricultural products, and other — each represented by 3 emoji, so users can browse by photo instead of needing to know product names.
  - Vegetables are further split into: leafy head vegetables, short-cycle leafy greens, root vegetables, flower/fruit/bean/gourd vegetables, mushrooms/sprouts.
  - Fruit is further split into: large/small berries, citrus, stone fruit, pome fruit.
- **Seller search:** After selecting a product, sellers are listed and can be sorted by organic/eco-friendly status, name, county/city, certification expiry date, or status, with 8/20/40/80/160/400 results per page.
- **Seller detail:** Shows certification info (certificate number, certifying body, expiry date, status), contact info (phone, registered address), map location, and the seller's other products/certified crops.
- **Map search:** Enter/select a product and locate the user, then list all sellers of that product sorted nearest-first; can also filter by clicking a city.
- **Map visualization:** Uses OpenStreetMap to show seller locations with organic/eco-friendly labels.

### Other pages

- **Info page:** Explains the damage caused by *Cnaphalocrocis medinalis*, the harms of pesticides, what can be done, certification status definitions, sources, and nationwide operator distribution.
- **About page:** Team introduction with links to Instagram, the school website, YouTube, and the [NoFold game](https://leilong20060926.github.io/CCU-iGEM-game/).

---

## Development

Technical notes for anyone working on the codebase.

### Project structure

```
.
├── client/             # Frontend
├── server/              # Backend (includes geocode cache)
├── public/             # Static assets
├── deprecated/          # Legacy code
└── docker-compose.yml
```

- `server`: API, runs on port `3000`, uses a `geocode-cache` volume to cache geocoding results
- `client`: exposed on port `8090` (container port `80`)

### Getting Started

```bash
git clone https://gitlab.igem.org/2026/software/ccu-taiwan/toam.git
cd toam
docker compose up -d
```

Once running:

- Frontend: `http://localhost:8090`
- Backend: `http://localhost:3000`

### Data source

- Taiwan MOA Friendly Farming & Organic Agriculture open data: https://epv.afa.gov.tw/

## License

This repository is licensed under the [Apache License 2.0](LICENSE).
