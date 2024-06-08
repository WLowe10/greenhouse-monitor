import type { GreenhouseJob, GreenhouseMonitor } from "./greenhouse/monitor.js";

export class Controller {
	private name: string;
	private monitor: GreenhouseMonitor;
	private prevJobIds: string[] = [];

	constructor(name: string, monitor: GreenhouseMonitor) {
		this.name = name;
		this.monitor = monitor;
	}

	public async pollNewJobs(): Promise<GreenhouseJob[]> {
		const allJobs = await this.monitor.poll(this.name);

		const newJobs = allJobs.filter((job) => !this.prevJobIds.includes(job.id));

		this.prevJobIds = allJobs.map((job) => job.id);

		return newJobs;
	}
}
