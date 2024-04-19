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
      }
    ]);
    this.config.set("title", this.answers.title);
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
  }

  install() {}
}
