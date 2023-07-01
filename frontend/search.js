const readFileSync = require("fs").readFileSync;
const exec = require("child_process").exec;

const dataLocation = process.argv[2];
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

  console.log(`${dataLocation}/static_resources/${info.link}`)
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
