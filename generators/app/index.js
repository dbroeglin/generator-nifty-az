"use strict";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import tmp from "tmp";

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("destination", { type: String, required: true });
    this.destinationRoot(this.options.destination);

    this.log("Generating in '" + this.options.destination + "'");
  }

  prompting() {
    this.log(yosay(`Welcome to ${chalk.red("Nifty AZ")} generator!`));
  }

  writing() {
    this.cloneDir = tmp.dirSync();
    this.spawnSync("git", [
      "clone",
      "--depth=1",
      "https://github.com/Azure-Samples/azure-search-openai-demo.git",
      this.cloneDir.name
    ]);

    this.fs.copy(this.cloneDir.name, this.destinationRoot(), {
      globOptions: {
        dot: true,
        ignore: ["**/data", "**/.git"]
      }
    });
  }

  install() {
    this.spawnSync("mkdir", ["data"]);
    this.spawnSync("git", ["init"]);
  }
}
