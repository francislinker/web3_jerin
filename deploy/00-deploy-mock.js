const {devlopmentChains,DECIMAL,INITIAL_ANSWER} = require("../helper-hardhat-config")
const { getNamedAccounts } = require("hardhat")

//编写部署的测试用例
//module.exports.default = deployFunction;
//getNamedAccounts 是账户信息
module.exports = async({getNameAccount,deployments}) => {
    
    if(devlopmentChains.includes(network.name)){
        const firstAccount = (await getNamedAccounts()).secondAccount
        const {deploy} = deployments;
        await deploy("MockV3Aggregator",{
            from:firstAccount,
            args:[DECIMAL,INITIAL_ANSWER],
            log:true
        })
        console.log("firstAccount",firstAccount)
        console.log('this deploy function')
    }else{
        console.log("not local network, skip deploy mock v3 aggregator")
    }
    

}

module.exports.tags = ["all","mock"];