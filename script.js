window.addEventListener("load", function() {
    const loader = document.querySelector(".loader-container");
    loader.className += " fade-out";
});

// Main Code
let languageTag = document.querySelector(".languages")
let languageNames = []
let languageCodes = []

// Language Functionality
let nlIcon = document.getElementById("nl-icon")
let nlNav = document.getElementById("nl-nav")
let nlNavVisibility = false
nlIcon.onclick = function() {
    if (nlNavVisibility === false) {
        nlNavVisibility = true
        nlNav.style.display = "block"
    } else {
        nlNavVisibility = false
        nlNav.style.display = "none"
    }
}

request("/text.json", function() {
    let lang = "en"

    if (this.readyState === 4 && this.status === 200) {
        let json = JSON.parse(this.responseText)
        json.sort(function(a, b) {
            return a.name.localeCompare(b.name)
        })

        for (let i = 0; i < json.length; i++) {
            // Variables
            let item = json[i]
            let name = item.name
            let code = item.lang
            let text = item.text

            // Cookies
            if (getCookie("lang") === code) {
                document.title = text[0]
                document.querySelector(".navbar .navbar-logo").innerText = text[1]
                document.getElementById("navbar-languages").innerText = text[2]
                document.getElementById("random-language").innerText = text[3]
                document.getElementById("navbar-about").innerText = text[4]
                document.getElementById("search").setAttribute("placeholder", text[5])
                document.querySelector("#about-page").innerHTML = `<div class="header">${text[6]}</div>`
                document.querySelector("#about-page").innerHTML += text[7]
                document.querySelector("#about-page").innerHTML += `<a class="page-x" id="about-page-x" href="#">X</a>`
            }

            // Main Code
            nlNav.innerHTML += `<li id="nl-${code.toLowerCase()}">${name}</li>`
        }
        for (let i = 0; i < json.length; i++) {
            let text = json[i].text

            let langItem = document.getElementById(`nl-${json[i].lang.toLowerCase()}`)
            langItem.onclick = function() {
                document.cookie = `lang=${json[i].lang.toLowerCase()}`
                document.title = text[0]
                document.querySelector(".navbar .navbar-logo").innerText = text[1]
                document.getElementById("navbar-languages").innerText = text[2]
                document.getElementById("random-language").innerText = text[3]
                document.getElementById("navbar-about").innerText = text[4]
                document.getElementById("search").setAttribute("placeholder", text[5])
                document.querySelector("#about-page").innerHTML = `<div class="header">${text[6]}</div>`
                document.querySelector("#about-page").innerHTML += text[7]
                document.querySelector("#about-page").innerHTML += `<a class="page-x" id="about-page-x" href="#">X</a>`
            }
        }
    }
})

// Add Code Languages
let client = new XMLHttpRequest()
client.onreadystatechange = function() {
    if (this.readyState === 4 && this.status === 200) {
        let data = JSON.parse(this.responseText)
        for (let i = 0; i < data.length; i++) {
            let languageName = data[i].lang
            let languageCode = data[i].code

            languageNames.push(`<a href="#${languageName.toLowerCase().replace(/ /g, "_")}">${languageName}</a>`)
            languageCodes.push(`<section id="${languageName.toLowerCase().replace(/ /g, "_")}"><pre class="code">${languageCode}</pre></section>`)
        }
        languageNames.sort()
        languageCodes.sort()

        for (let i = 0; i < languageNames.length; i++) {
            let languageNotLink = languageNames[i].replace(/<a href=".*">(.*)<\/a>/g, "$1").replace(/ /g, "_")
            languageTag.innerHTML += `<div class="item item-${languageNotLink.toLowerCase()}">${languageNames[i]}</div>`
        }
        for (let i = 0; i < languageCodes.length; i++) {
            let languageCodeTags = document.querySelectorAll(".hello-world-code")[0]
            languageCodeTags.innerHTML += languageCodes[i]
        }

        // Highlight Link
        let items = document.querySelectorAll(".item")
        for (let i = 0; i < items.length; i++) {
            let item = items[i]
            let itemA = item.querySelector("a")

            itemA.onclick = function() {
                let activeLinks = document.querySelectorAll(".active")
                for (let i = 0; i < activeLinks.length; i++) {
                    let active = activeLinks[i]
                    active.classList.remove("active")
                }
                item.classList.add("active")
            }
        }

        // Hrefs
        for (let i = 0; i < data.length; i++) {
            let language = data[i]
            if (language.href) {
                let languageName = language.lang
                let languageHref = language.href

                let a = document.createElement("div")
                let aa = document.createTextNode(`Learn more about ${languageName} `)
                a.appendChild(aa)

                let b = document.createElement("a")
                let ba = document.createTextNode("here")
                b.appendChild(ba)
                b.setAttribute("href", languageHref)
                b.setAttribute("target", "_blank")

                a.appendChild(b)

                document.getElementById(languageName.toLowerCase()).append(a)
            }
        }

        // Something
        document.getElementById("navbar-languages").onclick = function() {
            let activeLinks = document.querySelectorAll(".active")
            for (let i = 0; i < activeLinks.length; i++) {
                let active = activeLinks[i]
                active.classList.remove("active")
            }
        }

        // Also Something
        function randomLang() {
            // Remove Search Query
            searchEl.value = ""
            let items = document.querySelectorAll(".item")
            for (let i = 0; i < items.length; i++) {
                let item = items[i]
                item.removeAttribute("style")
            }

            // Remove Active Classes
            let activeLinks = document.querySelectorAll(".active")
            for (let i = 0; i < activeLinks.length; i++) {
                let active = activeLinks[i]
                active.classList.remove("active")
            }

            // Get Random Language
            let languageCount = data.length
            let random = data[Math.floor(Math.random() * languageCount)]
            window.location.hash = random.lang.toLowerCase()

            let theItem = `.item-${random.lang.toLowerCase().replace(/ /g, "_").replace(/\+/g, "\\+").replace(/#/g, "\\#").replace(/\./g, "\\.").replace(/!/g, "\\!")}`
            document.querySelector(theItem).classList.add("active")
        }
        document.getElementById("random-language").onclick = function() {
            randomLang()
        }

        // Search Tool
        let searchEl = document.getElementById("search")
        searchEl.onkeyup = function(e) {
            let searchQ = this.value
            searchQ = searchQ.toLowerCase().replace(/ /g, "_").replace(/\+/g, "\\+").replace(/#/g, "\\#").replace(/\./g, "\\.").replace(/!/g, "\\!")

            if (searchQ.length > 0) {
                let items = document.querySelectorAll(".item")
                for (let i = 0; i < items.length; i++) {
                    let item = items[i]

                    if (item.querySelector(`a[href*="${searchQ}"]`) === null) {
                        item.style.display = "none"
                    } else {
                        item.style.display = "inline-block"
                    }
                }
            } else {
                let items = document.querySelectorAll(".item")
                for (let i = 0; i < items.length; i++) {
                    let item = items[i]
                    item.removeAttribute("style")
                }
            }
        }

        // Search Icon Functionality
        let searchBarActive = false
        let searchIcon = document.getElementById("search-icon")
        searchEl.style.width = "0px"
        searchEl.style.padding = "0px"
        searchEl.style.paddingLeft = "0px"
        searchIcon.onclick = function() {
            if (searchBarActive === false) {
                searchBarActive = true

                searchEl.style.width = "250px"
                searchEl.style.padding = "7px"
                searchEl.style.paddingLeft = "40px"
                searchEl.style.filter = "opacity(1)"

                document.querySelector(".navbar").classList.add("navbar-blur")
                document.querySelector(".navbar-no-click").style.display = "block"
            } else {
                searchBarActive = false

                searchEl.style.width = "0px"
                searchEl.style.filter = "opacity(0)"
                document.querySelector(".navbar").classList.remove("navbar-blur")
                document.querySelector(".navbar-no-click").style.display = "none"

                setTimeout(function() {
                    searchEl.style.padding = "0px"
                    searchEl.style.paddingLeft = "0px"
                }, 250)
            }
        }

        // Window Location Hash
        let hash = window.location.hash.replace("#", "")
        document.getElementById(hash).style.display = "block"

        let hashClass = window.location.hash.replace("#", "").replace(/ /g, "_").replace(/\+/g, "\\+").replace(/#/g, "\\#").replace(/\./g, "\\.").replace(/!/g, "\\!")
        document.querySelector(`.item-${hashClass}`).classList.add("active")

        let hashItems = document.querySelectorAll(".item")
        for (let i = 0; i < hashItems.length; i++) {
            hashItems[i].onclick = function() {
                document.getElementById(hash).style.display = ""
            }
        }
    }
}
client.open("GET", "/languages.json", true)
client.send()

function request(url, func) {
    let client = new XMLHttpRequest()
    client.onreadystatechange = func
    client.open("GET", url, true)
    return client.send()
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}
