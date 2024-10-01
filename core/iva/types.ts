export type IvaContactInfo = {
  value: string;
  privacy: 'PUBLIC' | 'AUTHORIZED' | 'NOBODY';
};

export type IvaUserCreateData = {
  login: string;
  userType: 'ADMIN' | 'USER';
  securityLevel: 'UNCLASSIFIED' | 'CONFIDENTIAL' | 'SECRET' | 'TOP_SECRET';
  name: string;
  companyId?: string;
  email?: IvaContactInfo;
  phone?: IvaContactInfo;
  additionalContact?: IvaContactInfo;
  aboutSelf?: string;
  defaultMediaGroupId?: number;
  password?: string;
  vvoipLogin?: string;
  vvoipExtension?: string;
  vvoipSubnet?: string;
  vvoipPassword?: string;
  isConferenceCreationEnabled?: boolean;
};

export type IvaUserUpdData = {
  userType: 'USER' | 'ADMIN';
  login?: string;
  name?: string;
  email?: { value: string };
  phone?: { value: string };
  password?: string;
};

// @TODO need types for room features?

export type ParticipantRole = 'ATTENDEE' | 'INTERPRETER' | 'SPEAKER' | 'MODERATOR';
export type MediaState = 'NONE' | 'AUDIO' | 'VIDEO' | 'AUDIO_VIDEO';
export type JoinRestriction = 'ANYONE' | 'INVITED_OR_REGISTERED' | 'INVITED';
export type AttendeePermission =
  | 'SPEAKER_OTHER'
  | 'RECORD_ACCESS'
  | 'DOWNLOAD_DOCUMENTS'
  | 'UPLOAD_DOCUMENT'
  | 'BOARD_DRAWING'
  | 'CHAT_SEND_WITHOUT_PREMODERATION'
  | 'POLLING_CREATION'
  | 'INVITING_PARTICIPANTS'
  | 'MODERATOR_OTHER'
  | 'SEND_REQUEST_REMOTE_ACCESS'
  | 'DEMONSTRATE_DOCUMENTS'
  | 'PUBLISH_HTTP_REFERENCE_IN_CHAT'
  | 'PUBLISH_MESSAGES_IN_CHAT'
  | 'DOWNLOAD_RECORD'
  | 'RECEIVE_MEDIA';

export type IvaParticipant = {
  // Идентификатор профиля пользователя в IVA
  interlocutor: {
    profileId: string;
  };
  roles?: string[];
  interpreterLanguagesPair?: string[];
};

export type IvaConferenceSessionCreateRoomData = {
  name: string;
  description?: string;
  owner: { profileId: string };
  // Шаблон конференции, можно посмотреть список при вызове соответствующей API IVA
  conferenceTemplateId: string;
  settings?: {
    // Политика входа в комнату, все, только приглашенные или только приглашенные и зарегистрированные
    joinRestriction?: JoinRestriction;
    // Список прав на использование тех или иных функций IVA участнику конференции. (Удаленный доступ, использование видеокамеры и т.д.)
    attendeePermissions?: AttendeePermission[];
    // Шаблоны, содержащие настройки качества медиа потока для различного количества участников и режимов мероприятия. (Только видео, только звук, звук и видео, ничего)
    attendeeMediaState?: MediaState;
    // Список фич, которые можно включить/выключить в конференции (глобальная настройка комнаты)
    features?: { key: string; value: string | boolean }[];
  };
  // Список участников конференции
  participants: IvaParticipant[];
  // Код для "аутентификации", чтобы зайти в конференцию по ее номеру для не зарегистриррованного пользователя
  guestPasscode?: string;
  speakerPasscode?: string;
};
