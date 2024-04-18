"use strict";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import tmp from "tmp";

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.argument("appname", { type: String, required: true });

    // And you can then access it later; e.g.
    this.log(this.options.appname);
  }

  prompting() {
    this.log(yosay(`Welcome ${chalk.red("Nifty AZ")} generator!`));
  }

  writing() {
    this.cloneDir = tmp.dirSync();

    this.spawnSync("git", [
      "clone",
      "--depth=1",
      "https://github.com/Azure-Samples/azure-search-openai-demo.git",
      this.cloneDir.name
    ]);
    this.spawnSync("rm", ["-rf", `${this.cloneDir.name}/.git`]);

    this.fs.copy(this.cloneDir.name, this.destinationRoot(), {
      globOptions: { dot: true }
    });
  }

  install() {}
}
