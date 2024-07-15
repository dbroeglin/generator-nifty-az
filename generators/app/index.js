"use strict";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import tmp from "tmp";

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.argument("destination", {
      type: String,
      required: true,
      description: "Destination directory where the demo will be generated"
    });
    this.destinationRoot(this.options.destination);
  }

  async prompting() {
    this.log(yosay(`Welcome to ${chalk.red("Nifty AZ")} generator!`));

    this.answers = await this.prompt([
      {
        type: "list",
        name: "demo",
        message: "Select a demo",
        choices: [
          {
            name: "Azure-Samples/azure-search-openai-demo (Python)",
            value: "Azure-Samples/azure-search-openai-demo",
            description: "Azure Search with OpenAI Demo (Python)"
          },
          {
            name: "Azure-Samples/azure-search-openai-demo-java",
            value: "Azure-Samples/azure-search-openai-demo-java",
            description: "Azure Search with OpenAI Demo (Java)"
          }
        ]
      }
    ]);

    this.config.set("demo", this.answers.demo);
  }

  writing() {
    var demo = this.answers.demo;
    var destinationRoot = this.answers.destinationRoot;
    this.log(`Generating Demo '${demo}' in '${destinationRoot}'...`);

    this.cloneDir = tmp.dirSync();
    this.spawnSync("git", [
      "clone",
      "--depth=1",
      `https://github.com/${demo}.git`,
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
    this.spawnSync("git", ["init"]);
    this.spawnSync("git", ["add", "."]);
    this.spawnSync("git", ["commit", "-m", "Initial commit"]);
    this.spawnSync("mkdir", ["data"]);
  }
}
