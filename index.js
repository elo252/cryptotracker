const axios = require('axios')
const express = require('express')
const cheerio = require('cheerio')
const app = express()

async function getPriceFeed() {
    const url = 'https://coinmarketcap.com/'
    try{
        const { data } = await axios({
            method: "GET",
            url: url,
            
        })
        const $ = cheerio.load(data)
        const elemSel = "#__next > div > div.main-content > div.sc-57oli2-0.comDeo.cmc-body-wrapper > div > div:nth-child(1) > div.h7vnx2-1.bFzXgL > table > tbody > tr"
        const keys = [
            'rank',
            'name',
            'price',
            '24h',
            '7d',
            'marketCap',
            'volume',
            'circulatingSupply'
        ]
        
        const coinArr=[]

        $(elemSel).each((parentIdx, parentElem) => {
            let KeyIdx = 0
            const coinObj = {}

            if (parentIdx <= 9){
                $(parentElem).children().each((childIdx, childElem) => {
                    
                    let tdValue = $(childElem).text()
                    if(KeyIdx === 1 || KeyIdx === 6){
                        tdValue = $('p:first-child', $(childElem).html()).text()
                    }

                    if(tdValue){
                        coinObj[keys[KeyIdx]] = tdValue

                        KeyIdx++



                    }
                    
                })
                coinArr.push(coinObj)
            }
            
        })
        return coinArr
    }catch(err){
        console.error(err)
    }


}


app.get('/api/price-feed', async(req,res) => {
    try{
        const priceFeed = await getPriceFeed()
        return res.status(200).json({
            result: priceFeed,
        }) 
    }catch (err) {
        return res.status(500).json({
            err: err.toString()
        })
    }
})

app.listen(3000, ()=>{
    console.log('Server running on port 3000')
})

