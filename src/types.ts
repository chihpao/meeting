export interface DiscussionItem {
  topic: string;
  content: string;
  resolution: string;
}

export interface ActionItem {
  unit: string;
  task: string;
  deadline: string;
}

export interface MeetingResult {
  project_name: string;
  meeting_type: string;
  date: string;
  location: string;
  host: string;
  attendees: string[];
  discussion: DiscussionItem[];
  action_items: ActionItem[];
  follow_up: string;
}
