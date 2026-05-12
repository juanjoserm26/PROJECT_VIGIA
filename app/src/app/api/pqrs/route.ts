import { NextResponse } from 'next/server';

const TIPOS = new Set(['peticion', 'queja', 'reclamo', 'sugerencia']);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tipo, nombre, email, telefono, mensaje } = body;

    if (!tipo || !TIPOS.has(tipo) || !nombre || !email || !mensaje) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios o el tipo no es válido' },
        { status: 400 }
      );
    }

    // En producción: enviar a CRM, email transaccional, base de datos, etc.
    console.info('[PQRS]', {
      tipo,
      nombre: String(nombre).slice(0, 200),
      email: String(email).slice(0, 200),
      telefono: telefono ? String(telefono).slice(0, 50) : undefined,
      mensaje: String(mensaje).slice(0, 8000),
      receivedAt: new Date().toISOString(),
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('PQRS error:', e);
    return NextResponse.json({ error: 'Error al procesar la solicitud' }, { status: 500 });
  }
}
