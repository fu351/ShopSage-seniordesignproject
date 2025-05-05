import 'dotenv/config';
import axios from 'axios';

async function getLocations(zipCode) {
    try {
        let config = {
          method: 'get',
          maxBodyLength: Infinity,
          url: 'https://www.meijer.com/bin/meijer/store/search?locationQuery=47906&radius=20',
          headers: { 
            'accept': 'application/json, text/plain, */*', 
            'accept-language': 'en-US,en;q=0.9', 
            'cache-control': 'no-cache, no-store, must-revalidate, max-age=-1, private', 
            'priority': 'u=1, i', 
            'referer': 'https://www.meijer.com/shopping/store-finder.html', 
            'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"', 
            'sec-ch-ua-mobile': '?0', 
            'sec-ch-ua-platform': '"Windows"', 
            'sec-fetch-dest': 'empty', 
            'sec-fetch-mode': 'cors', 
            'sec-fetch-site': 'same-origin', 
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36', 
            'x-dtpc': '12$411356387_834h7vQDDEPHEFATESGPMPKJHRFHOEPJRHMIFC-0e0', 
            'Cookie': '_gcl_au=1.1.342436010.1744499937; al-id=9ed0b8d2-5e3d-4e05-92fb-52e4223cb5de; _scid=_JmtN63zRPaorAmcdkdqmNkuabNN54QmMT931w; _fbp=fb.1.1744499938711.894047072444570821; _pin_unauth=dWlkPU9USXdZVFF6WVdJdE0yUmhOUzAwWlRaakxUazROVFF0TnpVNE1UZzRNVEE0T1dNeQ; __adroll_fpc=01c89b1b20a9a59ba3b584b96fc8e8a4-1744499938842; dtm_token_sc=AQAIGlC_10F0lgFe1P_VAQH14QABAQCXLU2Z0QEBAJctTZnR; dtm_token=AQAIGlC_10F0lgFe1P_VAQH14QABAQCXLU2Z0QEBAJctTZnR; _gcl_gs=2.1.k1$i1746060889$u258002198; _gcl_ag=2.1.k0AAAAADixm5AS_XrvJQJZUVZuhLe9mQXzC$i1746060892$buYg0CJ6XtvkBEJC3xsUD; _ScCbts=%5B%5D; _sctr=1%7C1745985600000; meijer-store=319; kampylePageLoadedTimestamp=1746062411412; AKA_A2=A; AMCVS_A8643BC75245AF510A490D4D%40AdobeOrg=1; AMCV_A8643BC75245AF510A490D4D%40AdobeOrg=1278862251%7CMCIDTS%7C20214%7CMCMID%7C68812135450510862190908128021382042536%7CMCAAMLH-1747015946%7C7%7CMCAAMB-1747015946%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCCIDH%7C2107752573%7CMCOPTOUT-1746418346s%7CNONE%7CvVersion%7C4.0.0; cart-count=0; at_check=true; __gads=ID=e2f9afde3b2dcde9:T=1744499937:RT=1746411147:S=ALNI_Mbpl8p52JVJkrVz32pmom8iHxeKgA; __gpi=UID=0000109295e44429:T=1744499937:RT=1746411147:S=ALNI_MZCux8vo8Z_GP7xOhmEgBpH6DCjDA; __eoi=ID=01d5c37148f1c4fc:T=1744499937:RT=1746411147:S=AA-AfjZbIwONg8wuNMySqBdN9qHz; ak_bmsc=A75E733BDE8FC90B837F07D278981E93~000000000000000000000000000000~YAAQq6A7FyT+vYmWAQAAYlI3nhvJdvh+BLCFDRVAWO0o1QE7jSMDYKCZUW5wLkw3FS56iTabTWJ0v3XK/xsdyeve+pD7MldFaRKzqSP4ClF4s7v2cLkZtWVAG+JEksgTehieiwMU83zeJxlZjWTh+60LJ8hFg98i8Y9anuJxs+SWLOmqM6gXmoJIKvh0Z5NgKQWejfihBis4xMxlgKuZ9TSz2wSItMJRG+Mca9VO6iAkahUHyUKeGzebTUEQJwQ38SCPgcm9ACnMSQCqR0shtIUrxlqdd+88u0IwjP0fRRSEvRV69w1bTvQK8fy5MzDb2iejDGLPYxAO7+rtVkHcSzbK5EmRlT2IbsjC/MLp/PNbKAdUaBCl7YaBswKB7ym94/KDC5A/+vH95wit9+vQ4Lk40p4/vaQB1yEhivP98AWJpPRvsh54PzRK7vDqLYoxy5V+ugwN7r5nyIrN; rxVisitor=1746411147692IRCVN01N0RUT47N8N57LPR156OB29LMU; mboxEdgeCluster=34; s_cc=true; dtCookie=v_4_srv_12_sn_5BKD9FHLIT42LBHB2KFH6K0UTBLU05F0_app-3A510940fe27e3f293_1_ol_0_perc_100000_mul_1; tfpsi=86c3c2b3-84e0-44c1-8c7f-3eaca940f972; ConstructorioID_client_id=60163d8f-bfab-4c6d-9117-70f5f2d9f534; _abck=8362DC34DF948288C7EEE0CF5509C12B~0~YAAQq6A7F4f/vYmWAQAAyFs3ng1DNvR+xa7dKe/w+yGCZVgmbBo86WrVC2HFkKTMwqqXoNdhjd6DqKkZOfInBOvIEr7mhUd35lD4Rn79pE2pUpb+SiDdnM1mOBChtmfTZDjgCE02SDRU/Wf5YTTXt6ulLqpL1/QS/oHsTknYHNVfUu7jnvMwR//qoSXtOfRXABY5BLRcdwAcJykJly1pXOuwmOyceBM9rUIb69xhgITo5RcjRprtv6NqgJpBHJFO82/DnJoZCnFDCRxasvEVh4tyG4b4rdnMIMiFfD8IvhYdbRzdZ31s/dvS8t0GlnEe0wo09yHnNFul1Te611SKeF7aUGeRrxoDIGwdJJ5p4eRXGVeALZRw74zDlfQYytMW4djX/Fx5y4lTjqvz/su44LMYLK09vucZwt8adxrcneeL6s26GI/k3DWen3PDUF4gpdFi4SERWer5r0cXlNwnmPruqg90kvyjoCi1M1ACiTNLiFPcTsm5GJabjyVkBl1X2wqGfyEAuJuxwnPs2sWGA6+RW53aUPwuMa2kew==~-1~-1~1746414747; dtSa=-; digitalID=; s_gpv=Store%20Locator%3A%20Store%20Hours%2C%20Directions%2C%20and%20More%20%7C%20Meijer; s_nr365=1746411340591-Repeat; s_tp=1370; s_ppv=Store%2520Locator%253A%2520Store%2520Hours%252C%2520Directions%252C%2520and%2520More%2520%257C%2520Meijer%2C67%2C67%2C919; bm_sz=5E3B1BA955527556BBE7ECA10EC7B2F2~YAAQq6A7F1hyvomWAQAAa4A6nhtAXNjc8DUpSUG7p/8S7e4PBdGmOdgKcYT0wrTpGYzLH5hHteiqZtEjG6FyJRLZARGkaA0XrCjlzAxUUqTK1HGr6zOzQm9ygug0fZVJq37niKtA0Gd9F2g0AVBIDTs57LrsznZI73XE63Hj73InZFJ7iqd5fbmjuLYxUt1nZm0W37HtPjOvlbLziRlOly+fTGGL20Qs2iUt9FCwwUH6wbhviGlvo/Pa/+E80Zbv+eVaC+nmWqi8y5h5/phYPnGaQ0uvwhOwSK9Qi46xobTZK25yRArmjuhZNKYZCaYUGincYhzcMU7vkJZG19B7hKNz2zbOHlXpQeVFhJeBto3t7uOLC1O0vrJQNPePbs9+/gyf75bdbVwWkmTOiUDjnQSebBiLpka2WBSccAxdLueI1YuS8xFtCg==~3487814~3617075; RT="z=1&dm=meijer.com&si=74a08804-dda9-4c89-bb69-58bae506d593&ss=maag3sjs&sl=3&tt=2jy&bcn=%2F%2F17de4c0f.akstat.io%2F&obo=1&rl=1"; digital-cybersource=688121354505108621909081280213820425361746411356396; fs_lua=1.1746411356257; fs_uid=#10QQJ9#a5cb7ba5-2371-4f07-9b08-ac62b04b4bf1:e87e03e7-e308-4324-b028-0f4b025758aa:1746411146838::5#/1769181075; mbox=PC#b2a2fbf4325f4452bec6d023069322e6.34_0#1809656157|session#e5116ab760934928a0ee8be80a3bd7bb#1746413008; akavpau_VP2=1746411657~id=e3fc0f25dedec70f26ffe6ad130f6d12; _scid_r=_5mtN63zRPaorAmcdkdqmNkuabNN54QmMT936Q; cto_bundle=pXsJEF82S0tjZ0loaDJ0Nm1OU1JqM050d2hVQzIwNDdyZTRLZHY4U2dydkdsekJvRkFldG84TksxR2d1Rzh0a1olMkJGWnFGUyUyRmpISlREM3ZzZmJaVlB4b1pDZWczb2FQeGNhOUQ3VWtWSlExVXI2cTkyMGtBUmV3NFhCYXk3cTRrNDlheW5UZk5mUmRuVExscGx2ZXU1WUwwRExVNiUyRlkyZEJqb1A4UFZSYVhTb09Kdk1pTmxCUEtZd2xNQUlURG1yZ0lucnYxczMlMkJQcVJUMktGZWxXbmZXN3pXaSUyQkhWTVVUYWI3SEhTRnVoaUM0RVdJakdMeTZqQmJmS2tBYVRkR2w2VG4zJTJCSkVoMHhqbWtiSmx5UXhpTDgySkhRV20zYjlxNEFwV0o0RnRlUG90aFBDUFQwR3lhTkdwJTJCYWJhQXJIVTdBRCUyQjI; kampyleUserSession=1746411356873; kampyleUserSessionsCount=8; kampyleSessionPageCounter=1; kampyleUserPercentile=92.0636525100099; __ar_v4=UA2SGZLT2BBZ7EWBW3L5ND%3A20250412%3A19%7CPWUBTZL5E5AMTHINH7GARG%3A20250412%3A19; AWSALB=XvMvVcm/v/CjQnE5eEovsoAeOxVaBBJiQcPNJcbZzFs2sbxntsypVo1Mhud0kZJjOLthf3CWsem1JEENcTH0COqDAfgAPvBhiZ+65bEC1SQncOvUSE2okRN/8K7P; AWSALBCORS=XvMvVcm/v/CjQnE5eEovsoAeOxVaBBJiQcPNJcbZzFs2sbxntsypVo1Mhud0kZJjOLthf3CWsem1JEENcTH0COqDAfgAPvBhiZ+65bEC1SQncOvUSE2okRN/8K7P; bm_sv=669DA4E5A45D3CCAF28FBB0C71A327D4~YAAQq6A7F/VyvomWAQAAXIU6nht1b0dTVxTAVlDGga6WiuliLW6MRlik2oXzjqlE2KvPozsERRi5hvD9FZnGTbzI2Ohkt4ay1xrqDR73YGvBoAHX5AtJi+ZaCXSzRehI2gECed90EWdNtiaoNyz4zzQQODCe5/h0vX/NTmIQ8XcfPPHt5EPVlgJgg1jD8ztREJygB+b5rk47A3pCWCyjqfp++yBT3SubP7DOW1CWQfrpflGK1287yGWu2T4lU1lefA==~1; s_sq=meijerglobal2018prod%3D%2526c.%2526a.%2526activitymap.%2526page%253Dhttps%25253A%25252F%25252Fwww.meijer.com%25252Fshopping%25252Fstore-finder.html%2526link%253DSearch%2526region%253Dmain-content%2526.activitymap%2526.a%2526.c%2526pid%253Dhttps%25253A%25252F%25252Fwww.meijer.com%25252Fshopping%25252Fstore-finder.html%2526oid%253DfunctionJr%252528%252529%25257B%25257D%2526oidt%253D2%2526ot%253DBUTTON; rxvt=1746413163399|1746411147693; dtPC=12$411356387_834h7vQDDEPHEFATESGPMPKJHRFHOEPJRHMIFC-0e0; _abck=E1457770562C8543EA1138D61391895A~-1~YAAQq6A7F9/xvomWAQAAJBk+ng09cypUMAs1sqiC+qDNNYTOvZ2GQY/TTmYUu0GAzU0QwXppS5jfnj4idNFDLbq4B6hzPKFetiaH4/N9NhMcK4x5qEO3sksLSq0YLA2clfNbhW5gqsoEA9nVmseODwKU6WRXx2SAMOG68w0TTLimycGKyU0OOkpurYZbpFUnoGSLqtX2+wAdcqiq7PQoimOE8dnYr2g5wm3N706CrbD2Gs6PWQqcOSTVLqCJWi2HxefsSqzLGGOZWdERLcjpNcA5J8G1BeDXZ3ImVnoCNkq4Hz2Ynp1EXIP2eqpGqi8H21jyTszQTGWFz2/7A1LX1DADZBTIUMXvDWubQOO7bKI+vo9TeEeM7rhLlKOdXkzyP5aJOFud/sBPzRMqaTYY+D4/kjwWDAUbeoNKxTA=~-1~-1~-1; ak_bmsc=03BC44EEB05417BD116A59EDD67D1083~000000000000000000000000000000~YAAQq6A7F+DxvomWAQAAJBk+nhtOB25dZnIg4IvX9n7dwUgfRH6gDZpCkx9jbwSlSxjT+TZ8OOmpXZGYQ1JyanJfIqoNdGe45y4hI/vXoreutodFQZrV8hhkodhDWelzN6IJq5T2N1H1eJO2yJRwSBg0hDFr6wpFwJBssG/jePuDEO1ysrNbSrMgcLgI7HLe+FwCLfBu8Jc9zVXE0a/W4SwxeFABt0Wh5X2uOcqNCv7aNJyQraeDFgrC5O/M/21PNOz0GTuoQvdJz1rK78/0RA6dBtYB8lrsIM+N3nhqbi0C91F2hspRl3ulnojg8VACy/gSaoidz/cA1RMaODca8o8VqhWMMW8WqtI=; bm_sv=8E7CBEACFFBF233E6FA50E971E54B413~YAAQq6A7F7/yv4mWAQAA0SBFnhvKsIJCj5HP0pGdBoZyeTMqaWciSyRpETWVcg8YgCQ1orbYdWQDEk0LDNV+iZeMU4BDym7Ass5YKIkzpMH0AVGiVHRVN7PF7FOq8mShjueGIBqgVpv10on/yb5CE5t/KnLnY8abSolKEbrx6n7PzCPfuHjHu0SRBVYK3/z1Dgf/IyMph2XHMZVep2+B9EkLtR1+3caYYLgmIfLawJMELN7DNC6NMrspoQNr/c0k~1; bm_sz=404209A24100350734AA7C1B0C44EB0C~YAAQq6A7F+HxvomWAQAAJBk+nhv7pMHWJW+IzvvA2K3xLL3ZNtWu/sr+TY6+xYXgIECdvbCPZxTEDi47gA7Z7xPK+zEHOTeqkgUaG0pqMZ6WCKg7s7jMIc97k699trxMB9NkinGViplXUSGR6XOth3RPs7TRwcz1r6QzArQIrKPOBtiOknC9NTo1RxdxDPJAjORMyU/erkIQq/PC/JWesOW3zP9ivNpdOS1aRGetflaMvwD7h0ctzq7MmeDCj2P6frVEsjkm5a8mF/uBRWKpY22o4S+a0Mki7IAS7HbL8BYgKGpAYG+NgUn+ykPwBG5ws5vuj/XHKEEH56+G/9+eYU7s6YguuJeqos4ge28p~3487542~3683385; AWSALB=ki6d3k3HjTs3h4571A7w0gBZacfGMuS91SjGun1qeSHX96myRyfmQB+fdYFXOA8TV1LTjj5eDk5Kn4ean4mf8D2pOjNMfxmH7JdioSxeKuVBoP//saS5XmfDpwRS; AWSALBCORS=ki6d3k3HjTs3h4571A7w0gBZacfGMuS91SjGun1qeSHX96myRyfmQB+fdYFXOA8TV1LTjj5eDk5Kn4ean4mf8D2pOjNMfxmH7JdioSxeKuVBoP//saS5XmfDpwRS; akavpau_VP2=1746412352~id=1125f3c574e47fe88b3634f22ee790e0; al-id=78018734-9fc9-4799-bfd0-c526c7c0cced'
          }
        };
          
        const response = await axios.request(config);
        //console.log(JSON.stringify(response.data));

        return response.data;
    }

    catch (error) {
        console.error("Error getting locations:", error.response?.data || error.message);
        throw new Error("Error fetching locations.");
    }
}

async function Meijers(zipCode=47906, searchTerm) {
    const location_data = await getLocations(zipCode);
    const location = {
        "locationId": location_data.pointsOfService[0].mfcStoreId,
        "name": location_data.pointsOfService[0].displayName,
        "Address": location_data.pointsOfService[0].address
    }

    //console.log(location["locationId"]);
    //console.log(location["name"]);

    try {
        const response = await axios.get(`https://ac.cnstrc.com/search/${encodeURIComponent(searchTerm)}`, {
            params: {
                "c": "ciojs-client-2.62.4",
                "key": "key_GdYuTcnduTUtsZd6",
                "i": "60163d8f-bfab-4c6d-9117-70f5f2d9f534",
                "s": 4,
                "us": "web",
                "page": 1,
                "num_results_per_page": 52,
                "filters[availableInStores]": location["locationId"],
                "sort_by": "relevance",
                "sort_order": "descending",
                "fmt_options[groups_max_depth]": 3,
                "fmt_options[groups_start]": "current",
                "_dt": 1746061217801
            },
            headers: { 
                'accept': '*/*', 
                'accept-language': 'en-US,en;q=0.9', 
                'origin': 'https://www.meijer.com', 
                'priority': 'u=1, i', 
                'referer': 'https://www.meijer.com/', 
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"', 
                'sec-ch-ua-mobile': '?0', 
                'sec-ch-ua-platform': '"Windows"', 
                'sec-fetch-dest': 'empty', 
                'sec-fetch-mode': 'cors', 
                'sec-fetch-site': 'cross-site', 
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36'
            }
        });

        //console.log(JSON.stringify(response.data));
        const Products = response.data.response.results

        // Translate into shared format
        const details = Products.map(p => ({
            id: p.data.id,
            name: p.data.summary || null,
            brand: "N/A",
            description: p.value || null,
            category: null,
            price: p.data.price || null,
            unit: p.data.productUnit || null,
            pricePerUnit: "N/A",
            image_url: p.data.image_url,
            location: location["name"]
        }));

        // Sort by price and return the 10 cheapest options
        const sortedDetails = details
            .filter(item => item.price !== null) // filter out items with null price
            .sort((a, b) => a.price - b.price)
            .slice(0, 10);
        
        //console.log(sortedDetails)
        return sortedDetails;
        
    }
    catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        throw new Error("Error fetching products.");
    }
}

export { Meijers };