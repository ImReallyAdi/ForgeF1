import { ForgeClient, ForgeExtension } from "@tryforge/forgescript";
import { TypedEmitter } from "tiny-typed-emitter";
import { GithubCommandManager } from "./structures/GithubCommandManager";
import { IGithubEvents } from "./structures/GithubEventHandlers";
export interface IForgeGithubOptions {
    auth?: string;
    events?: Array<keyof IGithubEvents>;
    port?: number;
}
export type TransformEvents<T> = {
    [P in keyof T]: T[P] extends any[] ? (...args: T[P]) => any : never;
};
export declare class ForgeGithub extends ForgeExtension {
    private readonly options;
    name: string;
    description: string;
    version: any;
    latestEventType: string | null;
    latestPayload: Record<string, any> | null;
    private client;
    emitter: TypedEmitter<TransformEvents<IGithubEvents>>;
    commands: GithubCommandManager;
    constructor(options: IForgeGithubOptions);
    init(client: ForgeClient): void;
}
//# sourceMappingURL=index.d.ts.map