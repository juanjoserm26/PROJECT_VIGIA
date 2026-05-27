import { NextResponse } from 'next/server';
import {
  countUnreadPqrs,
  createPqrsServer,
  markPqrsReadServer,
  readPqrsServer,
} from '@/lib/pqrs-repository.server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const TIPOS = new Set(['peticion', 'queja', 'reclamo', 'sugerencia']);

export async function GET() {
  try {
    const items = await readPqrsServer();
    const sorted = [...items].sort(
      (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
    );
    return NextResponse.json({
      ok: true as const,
      items: sorted,
      unreadCount: countUnreadPqrs(sorted),
    });
  } catch (e) {
    console.error('PQRS list error:', e);
    return NextResponse.json({ ok: false as const, error: 'list_failed' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tipo, nombre, email, telefono, mensaje, markRead } = body;

    if (markRead === true) {
      const ids = Array.isArray(body.ids)
        ? (body.ids as unknown[]).filter((id): id is string => typeof id === 'string')
        : undefined;
      await markPqrsReadServer(ids);
      const items = await readPqrsServer();
      return NextResponse.json({
        ok: true as const,
        unreadCount: countUnreadPqrs(items),
      });
    }

    if (!tipo || !TIPOS.has(tipo) || !nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios o el tipo no es válido' },
        { status: 400 },
      );
    }

    const entry = await createPqrsServer({
      tipo,
      nombre: String(nombre),
      email: String(email),
      telefono: telefono ? String(telefono) : undefined,
      mensaje: String(mensaje),
    });

    if (!entry) {
      return NextResponse.json({ error: 'Tipo no válido' }, { status: 400 });
    }

    console.info('[PQRS]', {
      id: entry.id,
      tipo: entry.tipo,
      nombre: entry.nombre,
      email: entry.email,
      receivedAt: entry.receivedAt,
    });

    const items = await readPqrsServer();
    return NextResponse.json({
      ok: true as const,
      success: true,
      id: entry.id,
      entry,
      unreadCount: countUnreadPqrs(items),
    });
  } catch (e) {
    console.error('PQRS error:', e);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
