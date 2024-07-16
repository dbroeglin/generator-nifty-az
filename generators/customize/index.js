"use strict";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import * as cheerio from "cheerio";

export default class extends Generator {
  constructor(args, opts) {
    super(args, opts);

    this.escapeJavascriptString = function(str) {
      return str.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
    };

    this.escapeJsx = function(str) {
      return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/"/g, "&quot;");
    };

    this.notEmpty = function(str) {
      return str && str.trim() !== "";
    };

    this.replaceInFile = function(
      fileName,
      search,
      replace,
      replaceAll = false
    ) {
      const fileContent = this.readDestination(fileName);

      this.writeDestination(
        fileName,
        replaceAll
          ? fileContent.split(search).join(replace)
          : fileContent.replace(search, replace)
      );
    };
  }

  async prompting() {
    this.log(yosay(`Welcome to ${chalk.red("Nifty AZ")} generator!`));

    this.answers = await this.prompt([
      {
        type: "input",
        name: "title",
        message: "Your Demo's title",
        default: this.config.get("title") || "Nifty AZ Demo"
      },
      {
        type: "input",
        name: "question1",
        message: "Example question 1",
        default: this.config.get("question1") || ""
      },
      {
        type: "input",
        name: "question2",
        message: "Example question 2",
        default: this.config.get("question2") || ""
      },
      {
        type: "input",
        name: "question3",
        message: "Example question 3",
        default: this.config.get("question3") || ""
      },
      {
        type: "input",
        name: "placeholder",
        message: "Placeholder in question input field",
        default: this.config.get("placeholder") || ""
      },
      {
        type: "input",
        name: "backgroundColor",
        message: "Background color",
        default: this.config.get("backgroundColor") || "#222222"
      }
    ]);
    this.config.set("title", this.answers.title);
    this.config.set("question1", this.answers.question1);
    this.config.set("question2", this.answers.question2);
    this.config.set("question3", this.answers.question3);
    this.config.set("placeholder", this.answers.placeholder);
    this.config.set("backgroundColor", this.answers.backgroundColor);
  }

  writing() {
    var demo = this.config.get("demo");
    this.log(`Customizing Demo '${demo}'...`);

    var fileName = "app/frontend/index.html";
    const page = cheerio.load(this.readDestination(fileName));
    page("title").text(this.answers.title);
    this.writeDestination(fileName, page.html());

    this.replaceInFile(
      "app/frontend/src/pages/layout/Layout.tsx",
      /<h3 className={styles.headerTitle}>[^<]+<\/h3>/,
      "<h3 className={styles.headerTitle}>" +
        this.escapeJsx(this.answers.title) +
        "</h3>"
    );

    this.log(
      `Customizing ExampleList.tsx from template ${demo}/ExampleList.tsx.tt...`
    );
    this.fs.copyTpl(
      this.templatePath(`${demo}/ExampleList.tsx.tt`),
      this.destinationPath(
        "app/frontend/src/components/Example/ExampleList.tsx"
      ),
      {
        questions: [
          this.escapeJavascriptString(this.answers.question1),
          this.escapeJavascriptString(this.answers.question2),
          this.escapeJavascriptString(this.answers.question3)
        ]
      }
    );

    if (this.notEmpty(this.answers.placeholder)) {
      const oneshotFilename =
        demo === "Azure-Samples/azure-search-openai-demo"
          ? "app/frontend/src/pages/ask/Ask.tsx"
          : "app/frontend/src/pages/oneshot/OneShot.tsx";
      this.replaceInFile(
        oneshotFilename,
        /placeholder="Example: Does my plan cover annual eye exams\?"/,
        `placeholder="${this.escapeJsx(this.answers.placeholder)}"`
      );
      this.replaceInFile(
        "app/frontend/src/pages/chat/Chat.tsx",
        /placeholder="Type a new question \(e.g. does my plan cover annual eye exams\?\)"/,
        `placeholder="${this.escapeJsx(this.answers.placeholder)}"`
      );
    }

    this.replaceInFile(
      "app/frontend/src/pages/layout/Layout.module.css",
      /background-color: #222222/,
      `background-color: ${this.answers.backgroundColor}`,
      true
    );
  }

  install() {}
}
