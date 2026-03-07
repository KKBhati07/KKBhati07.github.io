# KKBhati07.github.io

Personal portfolio website built with HTML, CSS, and vanilla JavaScript.  
The site highlights backend-heavy full-stack projects, technical stack, and contact details.

## Live Site

https://KKBhati07.github.io

## Tech Stack

- HTML5
- CSS3
- Vanilla JavaScript
- GitHub Pages (deployment)

## Projects Overview

### Intelligent Auto Planner

Backend scheduling platform designed for automated resource allocation.

- Version 1: Greedy heuristic-based scheduling engine
- Version 2: Timefold-based Vehicle Routing Problem (VRP) optimization
- Stack: Spring Boot, PostgreSQL, Docker, GitHub Actions

### MarketMate

Production-grade classifieds platform (OLX-style) with distributed architecture, deployed on custom subdomains.

- **Architecture:** Spring Boot REST API (api), Angular SSR app (app), Nx admin panel (admin), NestJS chat service
- **Infra:** Custom domains & SSL, CORS/CSP, JWT httpOnly cookies, PostgreSQL, Redis, AWS S3
- **Deployment:** Backend & SSR on Render; Docker Compose; Prometheus & Grafana
- **Stack:** Angular, Spring Boot, NestJS, Nx, PostgreSQL, Redis, Docker, Render, Netlify
- **Live:** https://app.marketmatecloud.in

### Alphabet Music API

Music management backend with Android client integration.

- Node.js + Express backend
- MongoDB
- JWT authentication
- Android app consumes API and persists data

## Run Locally

Open `index.html` directly in a browser, or run a local static server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment

This repository is deployed using GitHub Pages.  
Any updates pushed to the published branch are reflected on the live site.
