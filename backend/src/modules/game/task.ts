import { appConfig } from "@/config"
import { Job, Queue, Worker } from "bullmq"
import { Redis } from "ioredis"

export class Task {
  private ioredis: Redis
  public queue
  private worker

  constructor() {
    this.ioredis = new Redis({
      port: appConfig.redisPort,
      host: appConfig.redisHost,
    })
    this.queue = new Queue("taskQueue", {
      connection: this.ioredis,
      defaultJobOptions: { removeOnComplete: true },
    })
    this.worker = new Worker("taskQueue", async (job) => {
      console.log(`Task job executed: ${job.id}`)
    })
  }

  public async createTask(delayInSeconds: number, callback: any) {
    const runAt = new Date(Date.now() + delayInSeconds * 1000)
    const newJob = await Job.create(this.queue, "taskQueue", {}, { delay: delayInSeconds * 1000 })
    await this.queue.add(newJob.name, { runAt })

    // Ожидаем выполнения задачи
    await this.worker.waitUntilReady()
    this.worker.on("completed", (job: Job) => {
      // Выполняем коллбэк после истечения таймера
      if (typeof callback === "function" && job.id === newJob.id) {
        callback()
      }
    })
    return newJob
  }

  public async cancelTask(jobId: string) {
    const job = await this.queue.getJob(jobId)

    if (job) {
      await job.remove()
      console.log(`Task job cancelled: ${jobId}`)
    }
  }
}
