
const puppeteer = require('puppeteer')

// Ler a página do Insta
async function start(){

    // Apertar botão More
    async function loadMore(page, selector){
        const moreButton = await page.$(selector)
        if(moreButton) {
            console.log("More")
            await moreButton.click()
            await page.waitFor(selector, {timeout: 3000}).catch( () => {console.log("timeout")})
            await loadMore(page, selector)
        }
    }

    
    // Pegar os comentários
    async function getComments(page, selector){
        const comments = await page.$$eval(selector, comments => 
            comments.map(comment =>
                [
                    comment.querySelectorAll('.FH9sR').innerHTML,
                    comment.getAttribute('time[datetime]')
                ] 
            )
        )

        console.log(comments)

        return comments
    }


    // async function getComments(page, selector){
    //     const comments = await page.$$eval(selector, comments => 
    //         comments.map(comment => comment.innerHTML)
    //     )

    //     console.log(comments)

    //     return comments
    // }


    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.instagram.com/p/CChMVvQgYKK/')
  
    await loadMore(page, '.dCJp8')
    const comments = await getComments(page, '.Mr508') 
    const counted = count(comments) 
    const sorted = sort(counted)    


    // sorted.forEach(comment => {        
    //     console.log(comment) 
    // }) 

    await browser.close()
}



// Contar comentários repetidos
function count(comments){
    const count = {}
    comments.forEach(comment => { count[comment] = (count[comment] || 0) + 1 })
    return count
}


// Ordenar
function sort(counted){
    const entries = []

    for(prop in counted){
        entries.push([prop, counted[prop]])
    }

    const sorted = entries.sort((a,b) =>  b[1] - a[1] ) // maior pro menor
    return sorted
}

start()