# Trudnik

Trudnik (Kariernik) je spletni portal za iskanje zaposlitve v Sloveniji. Zbira oglase za prosta delovna mesta iz javno dostopnih virov in jih prikazuje skupaj s podatki o podjetjih. Uporabniki lahko oglase iščejo po ključnih besedah, kategorijah in krajih ter si ogledajo profile podjetij.

## Struktura

```
Trudnik/
├── trudnik-backend/    # REST API (Node.js, Express, PostgreSQL)
└── trudnik-frontend/   # Spletni vmesnik (React, TypeScript, Vite)
```

## Namestitev

- **Frontend:** Vercel (korenska mapa `trudnik-frontend`)
- **Backend:** Railway (korenska mapa `trudnik-backend`)
- **Baza podatkov:** PostgreSQL na Supabase
