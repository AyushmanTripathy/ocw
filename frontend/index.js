import { parse } from "node-html-parser";
import { exec } from "child_process";
import { readFileSync } from "fs";

const dataLocation = "/home/ayush/ocw/6.006";
const write = (x) => console.log(x);
const loadJson = (x) => JSON.parse(readFileSync(x, "utf-8"))
const data = [];

init();
async function init() {
  let info = loadJson(dataLocation + "/info.json");
  const dmenu = (x, y) => `echo "${x}" | dmenu -p "${y}: " -l 10`
  const format = (list, prefix) => {
    let names = "";
    for (const i in list) {
      if (prefix) names += `${prefix} ${Number(i) + 1}: ${list[i].name}\n`
      else names += list[i].name + "\n";
    }
    return names;
  }
  const changeInfo = (x, y) => x[Number(y.split(":")[0].split(" ")[1]) - 1]

  const unit = await sh(dmenu(format(info), "Select Unit"))
  info = changeInfo(info, unit.stdout);
  const topic = await sh(dmenu(format(info.links, "Topic"), "Select Topic"))
  info = changeInfo(info.links, topic.stdout);

  if (info.links) {
    const doc = await sh(dmenu(format(info.links, "File"), "Choose File"))
    info = changeInfo(info.links, doc.stdout);
  }

  console.log(`${dataLocation}/static_resources/${info.content}`)
}

async function sh(cmd) {
  return new Promise(function (resolve, reject) {
    exec(cmd, (err, stdout, stderr) => {
      if (err) {
        reject(err);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}


function compile(path) {
  let tbody = parse(readFileSync(path, "utf-8")).childNodes[0];
  for (const tr of tbody.childNodes) {
    if (tr.constructor.name == "TextNode") continue;
    const heading = tr.querySelector("strong");
    if (heading) {
      data.push({
        name: heading.childNodes[0]._rawText,
        links: [],
      });
    } else {
      const td = tr.querySelector(`td[data-title="TOPICS: "]`);
      const ul = td.querySelector("ul");
      if (ul) {
        let name = "";
        for (const p of td.querySelectorAll("p")) {
          for (const child of p.childNodes) name += child._rawText.trim();
        }
        const ele = { name, links: [] };
        data[data.length - 1].links.push(ele);
        for (const li of ul.querySelectorAll("li"))
          ele.links.push(parseA(li.querySelector("a")));
      } else data[data.length - 1].links.push(parseA(td.querySelector("a")));
    }
  }
  console.log(JSON.stringify(data));
}

function parseA(a) {
  const href = a
    .getAttribute("href")
    .replace("index.html", "data.json")
    .replace("../..", dataLocation);
  const data = loadJson(href);
  return {
    name: a.childNodes[0]._rawText.trim(),
    content: data.file.split("/").pop()
  };
}

function parseHtmlEntities(str) {
  return str.replace(/&#([0-9]{1,5});/gi, (_, numStr) => {
    const num = parseInt(numStr, 10);
    return String.fromCharCode(num);
  });
}

function printTextNode(ele) {
  let printed = false;
  for (const child of ele.childNodes) {
    if (child.constructor.name == "TextNode") {
      const str = parseHtmlEntities(child._rawText);
      if (str) printed = true;
      write(str);
    } else if (child.rawTagName == "span") printTextNode(child);
    else if (child.rawTagName == "br") write("\n");
  }
  return printed;
}
