import { Command } from "@oclif/core";

export default class About extends Command {
  static override description = "Show the PROOF CLI package and plugin boundary.";

  static override examples = [
    "<%= config.bin %> <%= command.id %>"
  ];

  async run(): Promise<void> {
    this.log(`${this.config.bin} ${this.config.version}`);
    this.log("Product commands are provided by oclif plugins.");
    this.log("Public plugins: @proof-computer/proof-cli-baran, @proof-computer/proof-cli-blackbox, @proof-computer/proof-cli-liskov");
    this.log("Private plugins: Lockbox");
  }
}
