import { BaseJob } from "./BaseJob";

export class UserJob extends BaseJob {
  queueName = "user_queue";

  async process(data: any) {
    console.log(`Processing UserJob: ${JSON.stringify(data)}`);
  }
}
