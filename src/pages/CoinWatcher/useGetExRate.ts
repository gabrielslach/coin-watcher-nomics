import { useEffect, useState } from "react";

type coinDataType = {
    price: number,
    timestamp: Date
};

type nomicsTickerType = {
    key: string, coinID: string, convertCurr: string
}

const nomicsAPIEndPoint = ({key, coinID, convertCurr} : nomicsTickerType) => {
    return `https://api.nomics.com/v1/currencies/ticker?key=${key}&ids=${coinID}&interval=1h&convert=${convertCurr}`;
};

const fetchData = ({key, coinID, convertCurr} : nomicsTickerType) => {
    return fetch(
        nomicsAPIEndPoint({key, coinID, convertCurr})
        );
};

const useGetExRate = () => {
    const key = '5765911523337561951ce62583af84cf5e225cb9';
    
    const [coinData, setCoinData] = useState<coinDataType[]>([]);
    const [coinDataNow, setCoinDataNow] = useState<coinDataType>();

    const getInstExchange = async(coinID: string , convertCurr: string) => {
        const fetchResp = await fetchData({key, coinID, convertCurr});
        const respParsed: any[] = await fetchResp.json();
        
        const instCoinData: coinDataType = {
            price: Number(respParsed[0]?.price),
            timestamp: new Date()
        };
        
        setCoinDataNow(instCoinData);
    };

    useEffect(()=>{
        setCoinData(coinData => {
            if (coinDataNow) {
                coinData.push(coinDataNow);
            };
            
            return coinData;
        });
    }, [coinDataNow]);

    return {
        coinData,
        coinDataNow,
        getInstExchange
    }    
};

export default useGetExRate;