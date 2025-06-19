import { BaseEventHandler, ForgeClient } from "@tryforge/forgescript";
import { PushEvent, PullRequestEvent, StarEvent, DiscussionEvent, IssuesEvent, ReleaseEvent, CreateEvent, DeleteEvent, RepositoryEvent, LabelEvent, MilestoneEvent, ProjectEvent, ProjectCardEvent, ForkEvent, WatchEvent, IssueCommentEvent, PullRequestReviewEvent } from "../types/github";
export interface IGithubEvents {
    push: [PushEvent];
    pull_request: [PullRequestEvent];
    star: [StarEvent];
    discussion: [DiscussionEvent];
    issues: [IssuesEvent];
    release: [ReleaseEvent];
    create: [CreateEvent];
    delete: [DeleteEvent];
    repository: [RepositoryEvent];
    label: [LabelEvent];
    milestone: [MilestoneEvent];
    project: [ProjectEvent];
    project_card: [ProjectCardEvent];
    fork: [ForkEvent];
    watch: [WatchEvent];
    issue_comment: [IssueCommentEvent];
    pull_request_review: [PullRequestReviewEvent];
    error: [Error];
}
export declare class GithubEventHandler<T extends keyof IGithubEvents> extends BaseEventHandler<IGithubEvents, T> {
    register(client: ForgeClient): void;
}
//# sourceMappingURL=GithubEventHandlers.d.ts.map