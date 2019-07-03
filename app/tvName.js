const cheerio = require('cheerio');
const request = require('request');
const url = 'https://mediamarkt.pl/rtv-i-telewizory/telewizory?limit=100&page=';
const tvNameLink = [];
const tvNameList = [];
let name, link, pageNumber = 1;

req();

function parseResponseHtml(html) {
    const $ = cheerio.load(html);

    let attrProductName = $("a.js-product-name")
    let page = $("a.m-pagination_item.m-pagination_next")

    let it = 1;
    for (let i = 0; i < attrProductName.length - 1; i++) {

        let productName = attrProductName[i].attribs;
        if (attrProductName[i].attribs.href !== attrProductName[i + 1].attribs.href) {
            it++;
            name = productName.title;
            tvNameList.push({i, name })
            //console.log('name', name)

            link = 'https://mediamarkt.pl' + productName.href
            tvNameLink.push(i, link)
            //console.log(link)

        } else {
            productName = attrProductName[i + 1].attribs
        }
    }
    if (page.length > 0) {
        pageNumber++
        req()
    }
    console.log(tvNameList)
    console.log(tvNameLink)
    console.log(it)
}

function req() {
    request(url + pageNumber, function (error, response, html) {
        if (!error && response.statusCode == 200) {
            try {
                parseResponseHtml(html)
            } catch (error) {
                throw error
            }
        }
    })
}

//let page = $("a.m-pagination_item m-pagination_next")
//$("a.js-product-name").map((k,v)=> `https://mediamarkt.pl/rtv-i-telewizory${$(v).attr("href")}$/telewizory?limit=100`)