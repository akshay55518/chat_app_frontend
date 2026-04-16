export interface Chat {
  id: string;
  name: string;
  initials: string;
  lastMessage: string;
  time: string;
  online: boolean;
  unread?: number;
  avatarColor?: string;
}

export const chats: Chat[] = [
  {
    id: "1",
    name: "Julianne Moore",
    initials: "JM",
    lastMessage: "I've reviewed the drafts, they look ex...",
    time: "10:45 AM",
    online: true,
  },
  {
    id: "2",
    name: "Marcus Thorne",
    initials: "MT",
    lastMessage: "The editorial board meeting is set.",
    time: "Yesterday",
    online: false,
    avatarColor: "blue",
  },
  {
    id: "3",
    name: "Helena Ross",
    initials: "HR",
    lastMessage: "Sent an attachment",
    time: "Monday",
    online: false,
    unread: 2,
    avatarColor: "pink",
  },
];