import { NextRequest, NextResponse } from 'next/server';
import { getErrorResponse } from '@/lib/helpers';
import { CreateEventSchema } from './validation';
import { EventService } from '@/core/event/EventService';
import { EventManager } from '@/core/event/EventManager';
import { ParticipantService } from '@/core/participant/ParticipantService';
import { UserService } from '@/core/user/UserService';

export async function POST(req: NextRequest) {
  const eventManager = new EventManager(
    new EventService(),
    new ParticipantService(),
    new UserService()
  );

  try {
    const response = await eventManager.createEvent(
      CreateEventSchema.parse(await req.json())
    );

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    return getErrorResponse(error);
  }
}
