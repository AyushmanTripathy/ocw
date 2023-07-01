from bs4 import BeautifulSoup
from json import dumps, loads
from re import sub
import sys

def error(msg):
    print("[ERROR] " + msg)

def init(path):
    data = []
    table = BeautifulSoup(get_html(path), "html.parser").select("table")[0]
    for tr in table.select("tr"):
        heading = tr.select("strong")
        if (heading):
            data.append({ "name" : heading[0].text, "links": [] })
        else: 
            for td in tr.select("td"):
                ul = td.select("ul")
                if (len(ul) == 0):
                    # if not list
                    links = td.select("a")
                    if (len(links) == 1):
                        data[-1]["links"].append({ 
                            "name": links[0].text,
                            "link": get_link(links[0]["href"], path)
                        })
                else:
                    # if list
                    topic = { "name": td.select("p")[0].text, "links": [] }
                    for link in ul[0].select("a"):
                        topic["links"].append({ 
                            "name": link.text, 
                            "link": get_link(link["href"], path)
                        })
                    data[-1]["links"].append(topic)
    if (len(data) == 0):
        error("empty result")
        print("make sure you only give table element as input, without thead")
        return
    print(dumps(data))

def get_link(link, base):
    path = base.replace("index.html", "") + link.replace("index.html", "data.json")
    try:
        with open(path, "r") as file:
            return sub(r".*\/","", loads(file.read())["file"])
    except Exception as err:
        error("cannot open file")
        print(path)
        print(err)

def get_html(path):
    try:
        with open(path, "r") as file:
            return file.read()
    except Exception as err:
        error(err)
        error("failed to read html file")

if (len(sys.argv) == 1):
    error("input required")
    print("give the index.html file from pages/ as input")
    exit(1)
init(sys.argv[1])
