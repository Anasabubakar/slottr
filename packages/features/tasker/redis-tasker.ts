import { type Tasker, type TaskerCreate, type TaskTypes } from "./tasker";

/**
 * RedisTasker is a tasker that uses Redis as a backend.
 * WIP: This is a work in progress and is not fully implemented yet.
 **/
export class RedisTasker implements Tasker {
  create: TaskerCreate = async () => {
    throw new Error("Method not implemented.");
  };

  processQueue(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  cleanup(): Promise<void> {
    throw new Error("Method not implemented.");
  }

  cancel(_id: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  cancelWithReference(_referenceUid: string, _type: TaskTypes): Promise<string | null> {
    throw new Error("Method not implemented.");
  }
}
