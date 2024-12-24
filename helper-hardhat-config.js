const DECIMAL = 8;
const INITIAL_ANSWER = 400000000000
const devlopmentChains = ["hardhat","local"]
const CONFIRMATIONS = 5
const LOCK_TIME = 180
const networkConfig = {
    11155111: {
        ethUsdDataFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306"
    },
    97: {
        ethUsdDataFeed: "0x143db3CEEfbdfe5631aDD3E50f7614B6ba708BA7"
    }
}

module.exports = {
    DECIMAL,
    devlopmentChains,
    networkConfig,
    INITIAL_ANSWER,
    LOCK_TIME,
    CONFIRMATIONS,
    EXCHANGE_RATE: 1000 // 1000 USD = 1 SEPOLIA
}