export interface PushEvent {
  ref: string;
  before: string;
  after: string;
  pusher: {
    name: string;
    email: string;
  };
  repository: {
    full_name: string;
    url: string;
  };
  commits: Array<{
    id: string;
    message: string;
    url: string;
  }>;
}

export interface PullRequestEvent {
  action: string;
  number: number;
  pull_request: {
    title: string;
    body: string;
    merged: boolean;
    user: {
      login: string;
    };
    html_url: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
}

export interface StarEvent {
  action: string;
  repository: {
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface DiscussionEvent {
  action: string;
  discussion: {
    title: string;
    html_url: string;
    user: {
      login: string;
    };
  };
  repository: {
    full_name: string;
    html_url: string;
  };
}

export interface IssuesEvent {
  action: string;
  issue: {
    number: number;
    title: string;
    body: string;
    html_url: string;
    user: {
      login: string;
    };
  };
  repository: {
    full_name: string;
    html_url: string;
  };
}

export interface ReleaseEvent {
  action: string;
  release: {
    tag_name: string;
    name: string;
    body: string;
    html_url: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
}

export interface ForkEvent {
  forkee: {
    full_name: string;
    html_url: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface WatchEvent {
  action: string;
  repository: {
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface IssueCommentEvent {
  action: string;
  comment: {
    body: string;
    html_url: string;
    user: {
      login: string;
    };
  };
  issue: {
    number: number;
    title: string;
    html_url: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
}

export interface PullRequestReviewEvent {
  action: string;
  review: {
    body: string;
    html_url: string;
    user: {
      login: string;
    };
  };
  pull_request: {
    number: number;
    title: string;
    html_url: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
}

export interface CreateEvent {
  ref: string;
  ref_type: "branch" | "tag";
  master_branch: string;
  description: string | null;
  repository: {
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface DeleteEvent {
  ref: string;
  ref_type: "branch" | "tag";
  repository: {
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface RepositoryEvent {
  action: "renamed" | string;
  repository: {
    full_name: string;
    html_url: string;
    name: string;
    full_name_before?: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface LabelEvent {
  action: "created" | "edited" | "deleted";
  label: {
    name: string;
    color: string;
    description: string | null;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface MilestoneEvent {
  action: "opened" | "closed" | "created" | "deleted";
  milestone: {
    title: string;
    description: string | null;
    html_url: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface ProjectEvent {
  action: "created" | "updated" | "deleted";
  project: {
    name: string;
    body: string | null;
    html_url: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface ProjectCardEvent {
  action: "created" | "edited" | "moved" | "deleted";
  project_card: {
    note: string | null;
    column_name: string;
    html_url: string;
  };
  repository: {
    full_name: string;
    html_url: string;
  };
  sender: {
    login: string;
    html_url: string;
  };
}

export interface IGithubEvents {
  push: [PushEvent];
  pull_request: [PullRequestEvent];
  star: [StarEvent];
  discussion: [DiscussionEvent];
  issues: [IssuesEvent];
  release: [ReleaseEvent];
  fork: [ForkEvent];
  watch: [WatchEvent];
  issue_comment: [IssueCommentEvent];
  pull_request_review: [PullRequestReviewEvent];
  create: [CreateEvent];
  delete: [DeleteEvent];
  repository: [RepositoryEvent];
  label: [LabelEvent];
  milestone: [MilestoneEvent];
  project: [ProjectEvent];
  project_card: [ProjectCardEvent];
  error: [Error];
}
