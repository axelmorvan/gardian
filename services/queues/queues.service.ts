import Bull, { Queue as BullQueue, JobCounts } from "bull";

import {
  QueuesConfigService,
  queuesConfigService,
} from "../queues-config/queues-config.service";

import { Queue, SerializableQueue } from "./queue.interface";

export class QueuesService {
  private queues: Queue[] = [];

  constructor(private readonly queuesConfigService: QueuesConfigService) {}

  /** Returns list of queues and their stats */
  public async getQueuesList(): Promise<SerializableQueue[]> {
    if (this.queues.length === 0) {
      await this.refreshQueuesList();
    }

    return this.queues.map((q) => ({ ...q, client: q.client !== null }));
  }

  /** Returns counts of jobs in each state for all connected queue */
  public async getAllCounts(): Promise<Record<string, JobCounts>> {
    const counts: Record<string, JobCounts> = {};

    for (const queue of this.queues) {
      if (queue.client) {
        counts[queue.key] = await queue.client.getJobCounts();
      }
    }

    return counts;
  }

  /** Returns counts of jobs in each state for specific connected queue */
  public async getQueueCounts(key: string): Promise<JobCounts | null> {
    const queue = this.queues.find((q) => q.key === key) || null;
    if (queue?.client) {
      return queue.client.getJobCounts();
    }
    return null;
  }

  /** Return a serializable queue from its key */
  public async getQueueFromKey(key: string): Promise<SerializableQueue | null> {
    if (this.queues.length === 0) {
      await this.refreshQueuesList();
    }

    const queue = this.queues.find((q) => q.key === key);
    if (!queue) {
      return null;
    }

    return { ...queue, client: queue.client !== null };
  }

  /** Refresh list of known queues and try to connect to all */
  private async refreshQueuesList(): Promise<void> {
    await this.clearList();
    const config = this.queuesConfigService.getConfig();

    const promises = config.map(async (queueConfig): Promise<Queue> => {
      const queue: Queue = {
        key: `${queueConfig.name}_${queueConfig.host}`.replace(
          /[^a-z0-9]|\s+|\r?\n|\r/gim,
          "_"
        ),
        name: queueConfig.name,
        host: queueConfig.host,
        port: queueConfig.port,
        description: queueConfig.description,
        tags: queueConfig.tags,
        client: null,
      };

      try {
        queue.client = await this.connectQueue(queue);
      } catch (err) {
        queue.error = (err as Error).toString();
      }

      return queue;
    });

    const results = await Promise.allSettled(promises);
    for (const result of results) {
      if (result.status === "fulfilled") {
        this.queues.push(result.value);
      }
    }
  }

  /** Connect a queue with given params and returns client */
  private async connectQueue(queue: Queue): Promise<BullQueue | null> {
    return new Promise((resolve, reject) => {
      const client = new Bull(queue.name, {
        redis: { host: queue.host, port: queue.port },
      });
      client.on("error", reject);
      setInterval(() => {
        if (client.client.status === "ready") resolve(client);
      }, 10);
    });
  }

  /** Disconnect all queues and clear list */
  private async clearList(): Promise<void> {
    for (const queue of this.queues) {
      if (queue.client) await queue.client.close();
    }
    this.queues = [];
  }
}

export const queuesService = new QueuesService(queuesConfigService);
