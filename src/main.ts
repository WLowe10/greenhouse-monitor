import chalk from "chalk";
import scheduler from "node-schedule";
import path from "path";
import { GreenhouseMonitor } from "./greenhouse/monitor.js";
import { configSchema } from "./constants.js";
import { Controller } from "./controller.js";
import { sendDiscordWebhook } from "./utils/send-discord-webhook.js";

const greenhouseMonitor = new GreenhouseMonitor();

async function main() {
	const configResult = configSchema.safeParse(
		(await import(path.resolve(process.cwd(), "monitor.config.js"))).default
	);

	if (!configResult.success) {
		throw new Error("Invalid config");
	}

	const config = configResult.data;
	const controllers = new Map<string, Controller>();

	config.companies.forEach((company) => {
		controllers.set(company.name, new Controller(company.name, greenhouseMonitor));
	});

	// all monitored companies are scraped once per minute
	scheduler.scheduleJob("* * * * *", async (date) => {
		await Promise.allSettled(
			config.companies.map(async (company) => {
				const controller = controllers.get(company.name);

				if (!controller) {
					return;
				}

				const newJobs = await controller.pollNewJobs();
				const filter = company.filter || config.filter;

				await Promise.allSettled(
					newJobs.map(async (job) => {
						if (filter && !filter.test(job.title)) {
							return;
						}

						console.log(
							chalk.cyan(
								`[${date.getHours()}:${date.getMinutes()}] ${
									company.name
								} (New job):`
							),
							`${job.title} [${job.url}]`
						);

						if (config.discordWebhook) {
							await sendDiscordWebhook(config.discordWebhook, {
								company: company.name,
								job,
							});
						}
					})
				);
			})
		);
	});
}

main();
