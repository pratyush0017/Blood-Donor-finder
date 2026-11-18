# Blood Donor Finder (Frontend Only)

A modern, responsive, frontend-only **Blood Donor Finder** web application designed to help families and hospitals locate compatible blood donors during medical emergencies.

Built strictly with **HTML5**, **CSS3**, and **Vanilla JavaScript** — zero frameworks, zero external libraries, zero backend dependencies.

---

## Features

- **Home (`index.html`)**: Hero section ("Donate Blood, Save Lives"), 8 clickable blood group cards with live sample counts, How It Works, Why Choose Us, clearly labelled sample statistics, fictional testimonials, and consistent header/footer.
- **About Us (`about.html`)**: Platform mission, design principles, and an 8-group Blood Compatibility Chart.
- **Donor Registration (`register.html`)**: Full Vanilla JS validation (required fields, email, 10–15 digit phone, age 18–65, password, non-future donation date) with `localStorage` persistence.
- **Find Blood Donors (`find-donors.html`)**: 16 fictional donor records with real-time blood group dropdown + quick filter chips, city search, availability filter, clear filters button, live results count, and privacy-safe Contact Request modal (no personal contact info exposed).
- **Request Blood (`request-blood.html`)**: Validated emergency blood request form with priority tiers (Critical, Urgent, Standard), `localStorage` persistence, and a live recent demo requests sidebar.
- **Donor Dashboard (`donor-dashboard.html`)**: Interactive availability toggle, blood group compatibility summary, donation history table with demo logging, compatible recent blood requests with demo pledge button, and an Edit Profile modal.
- **Admin Dashboard (`admin-dashboard.html`)**: Live KPI cards (Total Donors, Total Blood Requests, Available Donors, Emergency Requests), searchable/filterable Donor Management and Blood Request Management tables, status controls, and a Reset Sample Data option.
- **Demo Login (`login.html`)**: Clearly labelled frontend-only demo login with quick-fill Donor/Admin buttons, Remember Me, and an interactive Forgot Password demo modal.
- **Contact Us (`contact.html`)**: Demo contact details and validated contact form with confirmation feedback.

---

## Folder Structure

```text
Blood-Donor-Finder/
│
├── index.html
├── about.html
├── register.html
├── login.html
├── find-donors.html
├── request-blood.html
├── donor-dashboard.html
├── admin-dashboard.html
├── contact.html
│
├── css/
│   └── style.css
│
├── js/
│   ├── script.js
│   ├── donors.js
│   └── dashboard.js
│
├── assets/
│   └── images/
│       ├── logo.svg
│       ├── hero-illustration.svg
│       └── about-illustration.svg
│
└── README.md
```

---

## Running Locally

1. Open this folder in **VS Code**.
2. Right-click `index.html` and select **Open with Live Server** (or open `index.html` directly in any modern browser).
3. All interactions use fictional sample data stored in browser `localStorage`.

---

## Future PHP & MySQL Integration Notes

The project is intentionally modular for seamless backend migration:
- Every form uses semantic `name` attributes, `method="post"`, and `data-future-endpoint` attributes.
- All data persistence is centralized in `window.BDFStore` inside `js/donors.js`, allowing `localStorage` calls to be swapped with `fetch()` calls to PHP/MySQL endpoints without redesigning the HTML or CSS.
