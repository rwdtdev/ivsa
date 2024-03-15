import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CreateEventSchema } from './validation';
import { EventService } from '@/core/event/EventService';

export async function POST(req: NextRequest) {
  const eventService = new EventService();

  try {
    const event = await eventService.create(CreateEventSchema.parse(await req.json()));

    return NextResponse.json({ eventId: event.id }, { status: 201 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
