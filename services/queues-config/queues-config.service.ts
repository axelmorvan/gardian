import fs from "fs";
import config from "config";
import yaml from "js-yaml";
import { InferType } from "yup";

import { queuesConfigSchema } from "./queues-config.schema";

export class QueuesConfigService {
  private config: InferType<typeof queuesConfigSchema>;

  constructor() {
    this.config = this.readConfigFile();
  }

  /** Return full config */
  public getConfig(): InferType<typeof queuesConfigSchema> {
    return this.config;
  }

  /** Read a yaml config file and load it in memory */
  private readConfigFile(): InferType<typeof queuesConfigSchema> {
    const filePath = config.get<string>("config.queuesConfigPath");
    const content = yaml.load(fs.readFileSync(filePath, "utf8"));
    return this.validateConfig(content);
  }

  /** Validate that config have correct format */
  private validateConfig(
    content: unknown
  ): InferType<typeof queuesConfigSchema> {
    return queuesConfigSchema.validateSync(content);
  }
}

export const queuesConfigService = new QueuesConfigService();
