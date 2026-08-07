import { Response } from "express";
import { prisma } from "../config/db";

const clients: Response[] = [];

export function addClient(res: Response) {
  // Set SSE headers
  res.writeHead(200, {
    Connection: "keep-alive",
    "Cache-Control": "no-cache",
    "Content-Type": "text/event-stream",
  });
  res.write("\n");

  clients.push(res);

  // Remove client when connection closes
  reqOnClose(res);

  // Send initial payload of published members
  prisma.member
    .findMany({ where: { published: true }, orderBy: { createdAt: "desc" } })
    .then((members) => sendEvent("members.initial", members))
    .catch(() => {});
}

function reqOnClose(res: Response) {
  // `close` isn't strongly typed on Response; use as any
  (res as any).on("close", () => {
    const idx = clients.indexOf(res);
    if (idx !== -1) clients.splice(idx, 1);
  });
}

export function sendEvent(event: string, data: any) {
  const payload = `event: ${event}\n` + `data: ${JSON.stringify(data)}\n\n`;
  for (const res of clients) {
    try {
      res.write(payload);
    } catch (err) {
      // ignore write errors; cleanup will happen on close
    }
  }
}

export function removeAllClients() {
  clients.splice(0, clients.length);
}
