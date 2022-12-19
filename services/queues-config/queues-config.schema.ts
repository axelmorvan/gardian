import { array, string, object, number } from 'yup';

export const queuesConfigSchema = array(
  object({
    /** Queue name */
    name: string().required(),
    /** Queue host */
    host: string().required(),
    /** Queue port */
    port: number().required(),
    /** Optional queue description */
    description: string().optional(),
    /** Optional queue tags */
    tags: array(string().required()).optional(),
  }),
).required();
