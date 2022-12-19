import { Queue as BullQueue } from "bull";

export interface Queue {
  /** Unique identifier of queue */
  key: string;
  /** Queue name */
  name: string;
  /** Queue host */
  host: string;
  /** Queue port */
  port: number;
  /** Optional queue description */
  description?: string;
  /** Optional queue tags */
  tags?: string[];
  /** Queue client when connected */
  client: BullQueue | null;
  /** Connection error */
  error?: string;
}

export interface SerializableQueue extends Omit<Queue, "client"> {
  /** Does have a client connected */
  client: boolean;
}
