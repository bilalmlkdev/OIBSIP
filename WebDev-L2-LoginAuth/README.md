# Login Auth

**OIBSIP · Web Development & Designing · Level 2 · Task 4**

Client-side register / login / dashboard / logout demo. **Passwords hashed with
SHA-256 (Web Crypto)** — never stored in plain text. Accounts live in
`localStorage` only (this is a demo, not production auth).

## Feature checklist

- [x] **Register:** name, email, password, confirm password
- [x] **Login:** email + password → session
- [x] **Dashboard:** welcome + name, email, session time; avatar initial
- [x] **Logout:** clears session, returns to login
- [x] **Validation:** email format, password ≥ 8 chars, confirm match,
      duplicate email rejected, wrong password rejected, unknown email rejected
- [x] **SHA-256 hashing** via `crypto.subtle.digest` (async)
- [x] Session persists across refresh (`localStorage`)
- [x] All events via `addEventListener` — no inline `onclick`
- [x] Tabs (Login / Register) with ARIA roles
- [x] Responsive

## Security note (demo only)

| Store | Contains |
|-------|----------|
| `oibsip-auth-users-v1` | `{ name, email, sha256hash, createdAt }` |
| `oibsip-auth-session-v1` | `{ email, since }` |

Real apps must use a server, HTTPS, salted KDF (bcrypt/argon2), and HttpOnly
cookies. This task runs fully in the browser for learning purposes.

## Run locally

```bash
cd WebDev-L2-LoginAuth
python3 -m http.server 8080
# open http://localhost:8080
```

> `crypto.subtle` requires a **secure context** — `http://localhost` is fine;
> other origins need HTTPS.

## Test cases

| Flow | Expected |
|------|----------|
| Register valid → | auto-login, dashboard shows name/email |
| Register same email again | "already exists" |
| Mismatched passwords | error, not registered |
| Login wrong password | "Incorrect password" |
| Login unknown email | "No account found" |
| Logout → refresh | back on login (session cleared) |
| Register → refresh | still logged in (session restored) |

## Screenshots

- `screenshots/register.png`
- `screenshots/login.png`
- `screenshots/dashboard.png`

## Author

Bilal Malik · [GitHub](https://github.com/bilalmlkdev) · [LinkedIn](https://linkedin.com/in/bilalmlkdev)

Part of [OIBSIP](https://github.com/bilalmlkdev/OIBSIP) · `#oasisinfobyte`
