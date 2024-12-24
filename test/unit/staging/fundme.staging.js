const { ethers, deployments, getNamedAccounts } = require("hardhat");
const { assert,expect } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const {devlopmentChains} = require("../../../helper-hardhat-config");


devlopmentChains.includes(network.name) 
? describe.skip:

//集成测试  测试网测试
describe("FundMe Contract", function () {
    let fundMe;
    let firstAccount;

    // 每次都运行一遍，部署所有带 "all" 标签的合约
    beforeEach(async function () {
        await deployments.fixture(["all"]); // 部署 tag 为 "all" 的合约
        firstAccount = (await getNamedAccounts()).firstAccount;
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address); 
    });

    //test fund and getfund successfully

    it("fund and getfund successfully", async function(){
        await fundMe.fund({value:ethers.parseEther("0.1")});
        //等待181秒 保证窗口关闭
        //保证部署成功收到回执
        await new Promise((resolve) => setTimeout(resolve,181*1000));
        const getFundTx = await fundMe.getFund()
        const getFundreciept = await getFundTx.wait()
        //参数为成功回执
        expect(getFundreciept)
        .to.be.emit(fundMe,"FundWithdrawByOwner")
        .withArgs(ethers.parseEther("0.1"))
    })
    //test fund and refund successfully

    it("fund and refund successfully", async function(){
        await fundMe.fund({value:ethers.parseEther("0.003")});
        //等待181秒 保证窗口关闭
        //保证部署成功收到回执
        await new Promise((resolve) => setTimeout(resolve,181*1000));
        const reFundTx = await fundMe.refund()
        const reFundreciept = await reFundTx.wait()
        //参数为成功回执
        expect(reFundreciept)
        .to.be.emit(fundMe,"refundbyfunder")
        .withArgs(firstAccount,ethers.parseEther("0.003"))
    })
});

