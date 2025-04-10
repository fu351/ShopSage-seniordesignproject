import 'dotenv/config';
import axios from 'axios';

async function SamsClubs(clubId=8169, searchTerm) {
    try {
        const response = await axios.get(`https://www.samsclub.com/api/node/vivaldi/browse/v2/products/search`, {
            params: {
                "sourceType": 1,
                "limit": 45,
                "clubId": clubId,
                "searchTerm": searchTerm,
                "br": true,
                "secondaryResults": 2,
                "wmsponsored": 1,
                "wmsba": true,
                "banner": true,
                "wmVideo": true
            },
            headers: {
                'accept': 'application/json, text/plain, */*',
                'accept-language': 'en-US,en;q=0.9',
                'priority': 'u=1, i',
                'referer': 'https://www.samsclub.com/s/bread',
                'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"Windows"',
                'sec-fetch-dest': 'empty',
                'sec-fetch-mode': 'cors',
                'sec-fetch-site': 'same-origin',
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
                'visitorid': 'TBJ8X70A34BZEe2OMN0nAI',
                'Cookie': 'sxp-rl-SAT_CME-rn=32; sxp-rl-SAT_DISABLE_SYN_PREQUALIFY-rn=33; sxp-rl-SAT_GEO_LOC-rn=75; sxp-rl-SAT_NEW_ORDERS_UI-rn=81; sxp-rl-SAT_ORDER_REPLACEMENT-rn=95; sxp-rl-SAT_REORDER_V4-rn=55; sxp-rl-SCR_CANCEL_ORDER_V3-rn=62; sxp-rl-SCR_CANRV4-rn=1; sxp-rl-SCR_NEXT3-rn=14; sxp-rl-SCR_OHLIMIT-rn=83; sxp-rl-SCR_SHAPEJS-rn=1; sxp-rl-SCR_VERIFICATION_V4-rn=79; sxp-rl-SAT_ADD_ITEM-rn=27; sxp-rl-SCR_RYE-rn=95; sxp-rl-SCR_SCRE-rn=67; sxp-rl-SCR_TII-rn=45; SAT_WPWCNP=1; vtc=TBJ8X70A34BZEe2OMN0nAI; sxp-rl-SAT_CME-c=r|1|100; SAT_CME=1; sxp-rl-SAT_DISABLE_SYN_PREQUALIFY-c=r|1|0; SAT_DISABLE_SYN_PREQUALIFY=0; sxp-rl-SAT_GEO_LOC-c=r|1|50; SAT_GEO_LOC=0; sxp-rl-SAT_NEW_ORDERS_UI-c=r|1|0; SAT_NEW_ORDERS_UI=0; sxp-rl-SAT_ORDER_REPLACEMENT-c=r|1|0; SAT_ORDER_REPLACEMENT=0; sxp-rl-SAT_REORDER_V4-c=r|1|0; SAT_REORDER_V4=0; sxp-rl-SCR_CANCEL_ORDER_V3-c=r|1|0; SCR_CANCEL_ORDER_V3=0; sxp-rl-SCR_CANRV4-c=r|1|100; SCR_CANRV4=1; sxp-rl-SCR_NEXT3-c=r|1|100; SCR_NEXT3=1; sxp-rl-SCR_OHLIMIT-c=r|1|0; SCR_OHLIMIT=0; sxp-rl-SCR_SHAPEJS-c=r|1|0; SCR_SHAPEJS=0; sxp-rl-SCR_VERIFICATION_V4-c=r|1|0; SCR_VERIFICATION_V4=0; sxp-rl-SAT_ADD_ITEM-c=r|1|100; SAT_ADD_ITEM=1; sxp-rl-SCR_RYE-c=r|1|100; SCR_RYE=1; sxp-rl-SCR_SCRE-c=r|1|100; SCR_SCRE=1; sxp-rl-SCR_TII-c=r|1|100; SCR_TII=1; AMCVS_B98A1CFE53309C340A490D45%40AdobeOrg=1; s_ecid=MCMID%7C61674181177848360680464918353110227399; AMCV_B98A1CFE53309C340A490D45%40AdobeOrg=1585540135%7CMCIDTS%7C20188%7CMCMID%7C61674181177848360680464918353110227399%7CMCAAMLH-1744835389%7C7%7CMCAAMB-1744835389%7CRKhpRz8krg2tLO6pguXWp5olkAcUniQYPHaMWWgdJ3xzPWQmdj0y%7CMCOPTOUT-1744237789s%7CNONE%7CMCAID%7CNONE%7CvVersion%7C4.4.0; s_cc=true; pxcts=62a9dfb7-1581-11f0-b3db-8965889eb1b0; _pxvid=62a9cd9a-1581-11f0-b3db-7b859751af0b; AUTOSELECTCLUB=1; __pxvid=62da4d7b-1581-11f0-bc3e-7ed2bbdac79d; _gcl_aw=GCL.1744230590.CjwKCAjwtdi_BhACEiwA97y8BO70tpq_R6i1GdpkwcZZHiG0gy9v06sb7iVtUEnzmHlw37qN57ZhWRoCo-8QAvD_BwE; _gcl_gs=2.1.k1$i1744230586$u107973760; _gcl_au=1.1.575488038.1744230590; astract=ca-ae69f7c7-1c36-47b4-95f4-f8a808b4345e; acstkn=74:11#566559635#7=843715306_1744230590555; QuantumMetricUserID=05f3816dd5a237c8f40e55a4c9e08ca5; rcs=eF5j4cotK8lMETA0NzbTNdQ1ZClN9jA2T7a0TDZK1TUxMkzUNTEFstLMU5J0zYzNTC3MDdKMTRINAJACDg0; _mibhv=anon-1744230592015-2839090225_4591; rmStore=dmid:8096; _fbp=fb.1.1744230592202.883505408732895125; _tt_enable_cookie=1; _ttp=01JRE3XBQARE1FRE5HBJN0RV21_.tt.1; _pin_unauth=dWlkPU9USXdZVFF6WVdJdE0yUmhOUzAwWlRaakxUazROVFF0TnpVNE1UZzRNVEE0T1dNeQ; cto_bundle=Ndr9qV9RNDlQY25penF1Z080dXc0V2l2ZTBxM2hhbU1OJTJGSm4wMSUyQmJTU1F5WkNCenRmeERhS2poWCUyQk5IeGJ2JTJGWEQxZ0FKc1I4UlBtVHlCcUJaZ1hYUFh5OVJQbHdRV2VmOENTcndwSG1LM0IwNDdQU1pRb0FMY1lJVE9nciUyQlVyYnlINHFydHBhdVYzNkVuRGhvQTFMRmhSa3BVbDNpUGM0Nmo1bktYJTJCVXVNendRYXNXNXRBTHE5MFE5SEY4cEVudkh2dFNLMlc0T0NHZ1JxeHVnY2dSekRGRjlCSW5JYzdrZkJCJTJGV0Y3dW40OGw0Y050T2xTJTJGbjBkRXNmSVdwWm5LJTJCNzdIczhXUGhOcXNucld4UXlsRkE5b2xKQSUzRCUzRA; SSLB=0; crl8.fpcuid=20007da9-85c5-4d01-be5a-f97f9f8133ff; smtrrmkr=638798273958164724%5E01961c3e-bce8-47ce-8052-3fb53842744f%5E01961c3e-bce8-4678-896e-317d7389eb9f%5E0%5E52.119.103.33; ttcsid=1744230592245.1.1744230878575; _uetsid=640b90c0158111f0a7eb7d3691349813; _uetvid=640b8ab0158111f0b5f2f72bfac517b4; __gads=ID=992c602eebe0fd4b:T=1744230591:RT=1744231905:S=ALNI_MZTC9PoKVI1QW8xnyI_SDug1MfArQ; __gpi=UID=0000108febc26f53:T=1744230591:RT=1744231905:S=ALNI_MYpvw5ASiaU764gtcqqOqXjgPV9nQ; __eoi=ID=9fd9b35d495b98a3:T=1744230591:RT=1744231905:S=AA-Afja6IkgedHZht1Dka6PMKbCA; s_sq=samclub3prod%3D%2526c.%2526a.%2526activitymap.%2526page%253Dsearch%25253Asearch-results%2526link%253DYour%252520clubLafayette%25252C%252520IN%2526region%253Dpage-top%2526pageIDType%253D1%2526.activitymap%2526.a%2526.c%2526pid%253Dsearch%25253Asearch-results%2526pidt%253D1%2526oid%253DfunctionUr%252528%252529%25257B%25257D%2526oidt%253D2%2526ot%253DBUTTON; ttcsid_C95MTH3C77U5QKC67MB0=1744230592240.1.1744231915485; QuantumMetricSessionID=5d1bca9fa413801d2b0f3bbae0f29879; bstc=UhveJIOyoiOf_TBdDJe6Ak; xpa=1dRg9|t5Tz_; exp-ck=1dRg92t5Tz_1; SAT_NEO_EXPO=1; SAT_CHATBOT=0; xpm=1%2B1744240997%2BTBJ8X70A34BZEe2OMN0nAI~%2B1; seqnum=3; akavpau_P1_Sitewide=1744241619~id=52121af8d104ddaa833e211d15242f6b; sams-pt=eyJ4NXQiOiJzOXN6ZUptWldjMWhRYktIOUVqSmNoOUZkTkEiLCJraWQiOiJCM0RCMzM3ODk5OTk1OUNENjE0MUIyODdGNDQ4Qzk3MjFGNDU3NEQwIiwidHlwIjoiSldUIiwiYWxnIjoiUlMyNTYifQ.eyJleHQiOiI4SkZtWW1KbE1HRTBNREV4T0dFNVkyUm1ZbUptTURGaU0yTXpOakk0TnpFME56Qm1OalUxWVRZMVlXWTJOekprTlRBMlpqa3daamsyTnpBeU9XVTRPV0ZpT1RnME5XWmhPVFpqWVRFNFlqTmpNRFUzWmpkak5UTTVZVEZrTkRrd1kyWmpZVE14Wm1NNFlUSmlOREJsWldWa1l6UmxZVGM1WVRNNE4yWTVNalkyTW1NM01tWXlNV0V5TmpReFlXWm1PVEkyTURNelpqazFZams1WldKaU5UZ3oiLCJ2ZXIiOiIxLjAiLCJjaGkiOiJkZXNrdG9wIiwiZmJ0IjpmYWxzZSwiYWhiIjp7InYiOnRydWUsInAiOltdfSwib3ZyZCI6ZmFsc2UsInNoYSI6eyJ2Ijp0cnVlLCJwIjpbXX0sImV4cCI6MTc0NDI0NDYxOSwiaWF0IjoxNzQ0MjQxMDE5LCJuYmYiOjE3NDQyNDEwMTksImlzcyI6Imh0dHBzOi8vdGl0YW4uc2Ftc2NsdWIuY29tL2M4Y2MwNzBlLWRmZWQtNDVjOS1iZGE1LTI5ZDAwMTIxYWNiYi92Mi4wLyIsImp0aSI6ImZiODkxZGUwLWNlMjItNDMwYi1hZTM3LTU0MGY4MDY1MTkyYyJ9.tvrVknbXN8gdzD_zmxZ9Ocz3t_9iiEYDiPGfM0DabpOtVdJvFSP3TDqCAbFq4MKCzy5Xx-G4Z8vPSPkMkXE7H8vUZ3egQtjOYsfcmmQ4XsIVoROK3KASnY77R1xyLFiH7g_culAXysZv1bKimw-n2k6Vm1EBaGWHTYRFla7HKuvIPO-sMaw4vSyoUHt6SYCdQCL2YQwIFkXld63ADChZ04L86IdLhf1zHyMky6DoWITzIXmGvCqi_43QZjLhATMf8rW766wCa6kxWyRrf3jmDLr12woFox2yIeJ-wYXXDGW4A10wkfubyQfrCpBH-XJVTWEzeizZSXJyLvF0cXYhck-TVvZpJgg5DleusdaEmWsfx2A4taK9iakabG591EiRH2lPNYv3Jla8RgTMBdrWe6KhepZ8amWtkFy6W1_I2ZlXV0hYJuSDyhfAq2ndP3Y8B91XLiMRggBW4O-RPyoJXpp2ALPXiqKKxPmbJ5CwnylFwZimR3U53yDFkOlv2KugONJ49_QWfe1NSBcu9k_bz3cRQVSyq_4uQIe2XNVMYlZr4gxRGbbXARCUE5WldEyX0B5mq0QyNBg1KThN72Mge-uhkVO1qsGaH0Fnb0QERI2W22jwCs1yGrYDF7la_G_BZgxBMzYg8Mp4CpBVuH4oOav9HN4e7c-PidnRiZE2BcY; xptwj=js:2a1aca71add3b962f70e:ixg6gfwAF3YGesfJxYamlD7jbtI8mgTEGb29aSiFkLEHp+QOfHa3QsYcVAHwuHH/wYFILEr1eVhYQ+nO3MfLkjpwhcdTSkGsiBFQNteMlSHkAON9fFfNQw==; TS017c4a41=01a3e7d84c063c616af8cb5c52dc5047410501bf134bc1d653a5931238e30fbb727a399a2c1ca812ca19ebcb8ce0e99b825fb42e90; TS01b1959a=01a3e7d84c063c616af8cb5c52dc5047410501bf134bc1d653a5931238e30fbb727a399a2c1ca812ca19ebcb8ce0e99b825fb42e90; TS017260c8=01a3e7d84c063c616af8cb5c52dc5047410501bf134bc1d653a5931238e30fbb727a399a2c1ca812ca19ebcb8ce0e99b825fb42e90; TSbdf847b3027=0816698a79ab200002f0c73636059c7fd3afe1a9b6e6f4fca4a537fe3dd131a2626f49e3325ae998086a91cb9111300009363720f8dba42b64133240f47822978049af523de2af4fe3ce7411e916030478b40d92fb3dd1eb8a1a6156523c0c8d; bm_sv=9C21D6E695C723C9D15C98988CA7EADA~YAAQvu0gF4x/fBaWAQAAR8rdHBuO/Qx6AaEuCDbSScUzK5gWM8v1FhhIUdJzz8BzxPYY5FHA/CMR7KU5ByzpP5pKXuDuxkabvnRpKJctkafOOT3i/7oGpDaG9qjFMz22FNHuSHDhCKZEEwTb8up1uzBaelxQ7nkqlHYY7qJZSGjBqtNlUqlqZtrxXITuky3X2fTBrJzQ5s7kuK7KbWaLkniFtzJ0+JP/fArTaHQVXCViaWRBVxomqUslJg1IJaOV0dk=~1; s_cpc=0; ak_bmsc=341111D6AF631E41CA376CADBC237BE2~000000000000000000000000000000~YAAQvu0gF6p/fBaWAQAAIszdHBvvcFoqJN9DMVfPSM+r82fduTT7XbftR2w9Qv0aKN4EYVwTKrbpOohdygtdDcf1F5JuivdEoYOUoQswS8Mei6CPAkCwr4EB3tpHUB5lpCr2RKhKqg4Bur0ah97PedZIrG0iSUH3wBZ7S9oZyXJYWJQ69CqfsBUszawDTgwa0cXXaXcyb2nVW0hG3ebz7kWJu6Iqa/5CrqEiza4pUBZEofriAZNL/oUpyqRthSmHTOynsP8cdX6CdKnMCDGJGUKL6BkRgxwfpVdKFdSh8CmM/6r03JaUjMi1r20I6WWZR5Nffr1mtz8MUXJCfs727OgxU/L/LlE+FsWdEjQ3A6bPMxpcbbFYbWTePfwrbLpOxUxcH60dQvkE1nxh8fR/MGVlIcUM1CsH5tp2A8cAB1dsJ7SjmOcU6mFSKY9oTthzoK3PaJqiOqTqtINEB74='
            }
        });
        
        const Products = response.data.payload.records

        // Translate into shared format
        const details = Products.map(p => ({
            id: p.productId,
            name: p.descriptors?.name || null,
            description: p.descriptors?.productdescription || null,
            category: p.category?.name || null,
            price: p.skus?.[0]?.clubOffer?.price?.finalPrice?.amount || null,
            image_url: `https://scene7.samsclub.com/is/image/samsclub/${p.skus?.[0]?.assets?.image || ''}`
        }));

        // Sort by price and return the 10 cheapest options
        const sortedDetails = details
            .filter(item => item.price !== null) // filter out items with null price
            .sort((a, b) => a.price - b.price)
            .slice(0, 10);
        
        console.log(sortedDetails)
        return sortedDetails;
        
    }
    catch (error) {
        console.error("Error fetching products:", error.response?.data || error.message);
        throw new Error("Error fetching products.");
    }
}

export { SamsClubs };