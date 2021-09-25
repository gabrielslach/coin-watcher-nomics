import React, { useEffect, useRef, useState } from 'react';

import {
    Flex, 
    Center, 
    Text, 
    Container, 
    Input, 
    VStack, 
    Button,
    Spacer
} from '@chakra-ui/react';

import useGetExRate from './CoinWatcher/useGetExRate';

const bindTo = (setStateFunc: any) => (event: any) => setStateFunc(event.target.value);

const CoinWatcher = () => {
    const {coinData, coinDataNow, getInstExchange} = useGetExRate();
    const [coinID, setCoinID] = useState<string>('WANA');
    const [convertCurr, setConvertCurr] = useState<string>('PHP');
    const [isTimerOn, setIsTimerOn] = useState(false);
    const [upperBound, setUpperBound] = useState<string>('');
    const [lowerBound, setLowerBound] = useState<string>('');

    const intervalCtrl = useRef<any>(null);
    const audio = useRef(new Audio('TF026.WAV'));

    const startTimer = () => {
        intervalCtrl.current = setInterval(()=>{
            if (coinID.length > 0 && convertCurr.length > 0) {
                getInstExchange(coinID, convertCurr);
            };
        }, 15000);
        setIsTimerOn(true);
        alert('Data is fetched at 15s interval')
    };

    const stopTimer = () => {
        clearInterval(intervalCtrl.current);
        setIsTimerOn(false);
        
        audio.current.pause();
    };

    useEffect(()=>{

        if (!isTimerOn) return;

        if (coinDataNow) {
            if (lowerBound && coinDataNow?.price <= Number(lowerBound)) {
                audio.current.play();
                alert(`${coinID} exchange rate reached the lower treshold`);
                audio.current.pause();
            };
            
            if (upperBound && coinDataNow?.price >= Number(upperBound)) {
                audio.current.play();
                alert(`${coinID} exchange rate reached the upper treshold`);
                audio.current.pause();
            };
        };
    }, [coinDataNow, isTimerOn]);

    useEffect(()=>{
        const coinID_ = 'WANA', convertCurr_ = 'PHP';
        setCoinID(coinID_);
        setConvertCurr(convertCurr_);
        getInstExchange(coinID_, convertCurr_);
    }, []);

    return (
        <Flex p={5} color="white" bg="blackAlpha.800" minH='100vh' direction='column'>
            <Text fontSize='3xl' >Coin Watcher</Text>
            <Center w="full" p={5}>
                <Container py={5} bg="gray.900" maxW='container.lg' borderRadius='lg' >
                    <VStack spacing={4} align='stretch' >
                        <Text fontSize='4xl' textAlign='center' >
                            1 {coinID} = {coinDataNow?.price.toFixed(3)} {convertCurr}
                        </Text>
                        <Input placeholder="Coin ID" value={coinID} onChange={bindTo(setCoinID)} disabled={isTimerOn} />
                        <Input placeholder="Currency" value={convertCurr} onChange={bindTo(setConvertCurr)} disabled={isTimerOn} />
                        <Input placeholder="Upper bound price to watch" value={upperBound} onChange={bindTo(setUpperBound)} disabled={isTimerOn} />
                        <Input placeholder="Lower bound price to watch" value={lowerBound} onChange={bindTo(setLowerBound)} disabled={isTimerOn} />
                        <Spacer/>
                        <Button colorScheme="twitter" onClick={startTimer} disabled={isTimerOn}>{isTimerOn ? 'Active...':'Set Alarm'}</Button>
                        <Button colorScheme="red" onClick={stopTimer} disabled={!isTimerOn}>Stop Alarm</Button>
                    </VStack>
                </Container>
                {coinData}
            </Center>
            <Spacer/>
            <a href='https://nomics.com/'><Text textAlign='center' >Crypto Market Cap & Pricing Data Provided By Nomics</Text></a>
        </Flex>
    )
};

export default CoinWatcher;