# AURELIA · Maison de Parfum

A single-page luxury storefront with a typed API, a pricing analytics script
and a Java pricing service.

## Run it

```bash
# storefront: open public/index.html in any modern browser

# API
cd server && npm install && npm run build && npm start   # http://localhost:3000

# analytics
python3 analytics/pricing.py

# pricing service (JDK 17+)
javac -d out services/src/main/java/com/aurelia/Pricing.java
java -cp out com.aurelia.Pricing
```

## API

| Method | Route            | Purpose                          |
|--------|------------------|----------------------------------|
| GET    | /api/products    | Catalogue with stock             |
| POST   | /api/subscribe   | Join The Circle `{email}`        |
| POST   | /api/order       | Place order `{lines:[{id,qty}]}` |

## Design notes

- No framework or build step on the front end, and no external scripts.
- Prices are validated on the server, never trusted from the client.
- Motion respects `prefers-reduced-motion`; colour tokens follow the system theme.

## References

Fielding, R. T. (2000). *Architectural styles and the design of network-based
software architectures* [Doctoral dissertation, University of California, Irvine].

World Wide Web Consortium. (2023). *Web content accessibility guidelines (WCAG) 2.2*.
https://www.w3.org/TR/WCAG22/
