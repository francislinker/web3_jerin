const { ethers, deployments, getNamedAccounts, network } = require("hardhat");
const { assert,expect } = require("chai");
const helpers = require("@nomicfoundation/hardhat-network-helpers");
const {devlopmentChains} = require("../../helper-hardhat-config");


// 跳过非 development 环境的测试 三元操作符号 cond1 ? func1 : func2

!devlopmentChains.includes(network.name) 
? describe.skip:

//单元测试
describe("FundMe Contract", function () {
    let fundMe;
    let fundMeSecondAccount;
    let firstAccount;
    let secondAccount;
    let mockV3Aggregator;

    // 每次都运行一遍，部署所有带 "all" 标签的合约
    beforeEach(async function () {
        await deployments.fixture(["all"]); // 部署 tag 为 "all" 的合约
        firstAccount = (await getNamedAccounts()).firstAccount;
        secondAccount = (await getNamedAccounts()).secondAccount;
        mockV3Aggregator = await deployments.get("MockV3Aggregator")// 获取部署后的合约实例
        const fundMeDeployment = await deployments.get("FundMe");
        fundMe = await ethers.getContractAt("FundMe", fundMeDeployment.address);
        // 第二个账户也部署 FundMe 合约，方便后续的测试
        fundMeSecondAccount = await ethers.getContractAt("FundMe", secondAccount)
    });

    // 测试合约所有者是否为 msg.sender
    it("should set the deployer as the owner", async function () {
        const [deployerAccount] = await ethers.getSigners(); // 获取 signer
        const owner = await fundMe.owner(); // 调用合约函数获取 owner
        assert.equal(owner, deployerAccount.address);
    });

    // 测试合约地址是否一致
    it("should have the correct dataFeed address", async function () {
        const dataFeed = await fundMe.dataFeed(); // 调用合约函数获取 dataFeed
        assert.equal(dataFeed,mockV3Aggregator.address);
    });


    //fund,getfund,refund
    //unit test for fund
    //window open
    //保证时间窗口关闭 第一种测试情况
    it("window closed,value greater than minimum", async function () {
        await helpers.time.increase(200);
        await helpers.mine();
        //捐款 预期被退回
        expect(fundMe.fund({value:ethers.parseEther("0.1")}))
        //返回是提示语
        .to.be.revertedWith("window is closed")//换算
    }
)
    //第二种测试情况
    it("window open,value less than minimum", 
        async function () {
        expect(fundMe.fund({value:ethers.parseEther("0.001")}))
        .to.be.revertedWith("Send more ETH")//换算
    }
)

    //第三种测试情况 正常情况
    it("window open,value less than minimum,fund success", 
        async function () {
        await fundMe.fund({value:ethers.parseEther("0.1")})
        const balance = await fundMe.fundersToAmount(firstAccount)
        //比较余额是否一致
        expect(balance).to.equal(ethers.parseEther("0.1"))
    }
)

    //第四种测试用例 getfund (only owner, window close,taret reach)
    it("not onwer,window close,taret reach getfund failed", 
        async function (){
            //target reach
            await fundMe.fund({value:ethers.parseEther("0.1")});
            await helpers.time.increase(200);
            await helpers.mine();
            expect(fundMeSecondAccount.getFund())
            .to.be.revertedWith("this function can only be called by owner")
        })

    //第五种测试用例 getfund (only owner, window close,taret reach)
    it("window open,taret reach getfund failed", 
        async function (){
            //target reach
            await fundMe.fund({value:ethers.parseEther("0.1")});
            await expect(fundMe.getFund())
            .to.be.revertedWith("window is not closed")
        })

    //第六种单元测试用例 getfund (only owner, window close,taret not reach)
    it("window open,taret not reach getfund failed", 
        async function (){
            //target not reach
            await fundMe.fund({value:ethers.parseEther("0.003")});
            await helpers.time.increase(200);
            await helpers.mine();
            await expect(fundMe.getFund())
            .to.be.revertedWith("Target is not reached")
        })

        //第七种单元测试用例 getfund (only owner, window close,taret reach success)
        //预期返回emit 是0.1
        it("window open,taret not reach getfund success", 
            async function (){
                //target not reach
                await fundMe.fund({value:ethers.parseEther("0.1")});
                await helpers.time.increase(200);
                await helpers.mine();
                await expect(fundMe.getFund())
                .to.emit(fundMe,"FundWithdrawByOwner").withArgs(ethers.parseEther("0.1"));
            })

        //refund
        //windows close, taraget not reach, funder has balance
        it("widnow open,target not reach,funder has balance"),
        async function () {
            await fundMe.fund({value:ethers.parseEther("0.001")});
            await expect(fundMe.refund()).to.be.revertedWith("window is not closed")
        }


});

