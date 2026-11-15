import http from "node:http";
import { randomUUID } from "node:crypto";

interface Product { id: string; name: string; price: number; stock: number }
interface Line { id: string; qty: number }

const products: Product[] = [
  { id: "noir", name: "Noir Absolu", price: 340, stock: 40 },
  { id: "ambre", name: "Ambre Soleil", price: 295, stock: 60 },
  { id: "rose", name: "Rose Éternelle", price: 310, stock: 55 },
];
const circle = new Set<string>();
const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function readJson<T>(req: http.IncomingMessage): Promise<T> {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (c) => {
      raw += c;
      if (raw.length > 1e5) req.destroy();
    });
    req.on("end", () => {
      try { resolve(JSON.parse(raw || "{}") as T); } catch (e) { reject(e); }
    });
  });
}

function send(res: http.ServerResponse, code: number, body: unknown): void {
  res.writeHead(code, { "Content-Type": "application/json" });
  res.end(JSON.stringify(body));
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/api/products") return send(res, 200, products);

    if (req.method === "POST" && req.url === "/api/subscribe") {
      const { email } = await readJson<{ email?: string }>(req);
      if (!email || !emailRe.test(email)) return send(res, 400, { error: "invalid email" });
      circle.add(email.toLowerCase());
      return send(res, 201, { members: circle.size });
    }

    if (req.method === "POST" && req.url === "/api/order") {
      const { lines } = await readJson<{ lines?: Line[] }>(req);
      if (!Array.isArray(lines) || !lines.length) return send(res, 400, { error: "empty order" });
      let total = 0;
      for (const l of lines) {
        const p = products.find((x) => x.id === l.id);
        if (!p || !Number.isInteger(l.qty) || l.qty < 1 || l.qty > p.stock)
          return send(res, 422, { error: `bad line: ${l.id}` });
        total += p.price * l.qty;
      }
      for (const l of lines) products.find((x) => x.id === l.id)!.stock -= l.qty;
      return send(res, 201, { orderId: randomUUID(), total });
    }

    send(res, 404, { error: "not found" });
  } catch {
    send(res, 400, { error: "bad request" });
  }
});

server.listen(Number(process.env.PORT) || 3000);
