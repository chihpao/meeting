export interface ActionItem {
  owner: string;
  deadline: string;
  priority: string;
  task: string;
}

export interface Risk {
  description: string;
  level: string;
  mitigation: string;
}

export interface MeetingResult {
  title: string;
  date: string;
  attendees: string[];
  summary: string;
  discussion_points: string[];
  decisions: string[];
  action_items: ActionItem[];
  risks: Risk[];
  next_meeting: string;
}
