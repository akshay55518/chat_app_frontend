export interface Message {
  id: number;
  text: string;
  is_sender: boolean;
  time: string;
  read?: boolean;
}

export const messages: Record<string, Message[]> = {
  "1": [
    {
      id: 1,
      text: "Hello! I've been going through the latest editorial spreads for the spring issue. The lighting in the coastal series is absolutely breathtaking.",
      is_sender: false,
      time: "10:42 AM",
    },
    {
      id: 2,
      text: "I'm so glad you liked them! We spent three days chasing the golden hour at Big Sur. Should we prioritize the landscape shots for the cover?",
      is_sender: true,
      time: "10:44 AM",
      read: true,
    },
    {
      id: 3,
      text: "Definitely the cover. Also, Marcus mentioned he needs the copy by Friday morning. Do you think we can finalize the captions tonight?",
      is_sender: false,
      time: "10:45 AM",
    },
  ],
  "2": [
    {
      id: 1,
      text: "The editorial board meeting is set for Thursday at 3 PM.",
      is_sender: false,
      time: "Yesterday",
    },
    {
      id: 2,
      text: "Perfect, I'll have everything prepared.",
      is_sender: true,
      time: "Yesterday",
      read: true,
    },
  ],
  "3": [
    {
      id: 1,
      text: "Sent an attachment",
      is_sender: false,
      time: "Monday",
    },
  ],
};