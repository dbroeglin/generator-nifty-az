"use strict";
import Generator from "yeoman-generator";
import chalk from "chalk";
import yosay from "yosay";
import * as cheerio from "cheerio";

export default class extends Generator {
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
      }
    ]);
    this.config.set("title", this.answers.title);
    this.config.set("question1", this.answers.question1);
    this.config.set("question2", this.answers.question2);
    this.config.set("question3", this.answers.question3);
  }

  writing() {
    var fileName = "app/frontend/index.html";
    const page = cheerio.load(this.readDestination(fileName));
    page("title").text(this.answers.title);
    this.writeDestination(fileName, page.html());

    fileName = "app/frontend/src/pages/layout/Layout.tsx";
    const file = this.readDestination(fileName);
    this.writeDestination(
      fileName,
      file.replace(
        /<h3 className={styles.headerTitle}>[^<]+<\/h3>/,
        "<h3 className={styles.headerTitle}>" + this.answers.title + "</h3>"
      )
    );

    this.fs.copyTpl(
      this.templatePath("ExampleList.tsx.tt"),
      this.destinationPath(
        "app/frontend/src/components/Example/ExampleList.tsx"
      ),
      {
        questions: [
          this.answers.question1,
          this.answers.question2,
          this.answers.question3
        ]
      }
    );
  }

  install() {}
}
