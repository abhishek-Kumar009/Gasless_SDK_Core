var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { GaspayManager } from '../src/gaspay';
import { expect } from 'chai';
import { getContractAddress, getNonce } from '../src/utils';
const polygonAdd = '0x9632b2A066b95A1521a8774F7367882681C6ACF1';
import { abi } from '../src/abis/ERC20';
const sigUtil = require('@metamask/eth-sig-util');
// require('dotenv').config()
var ERROR;
(function (ERROR) {
    ERROR["NO_SIGNATURE"] = "Invalid signature";
})(ERROR || (ERROR = {}));
const transactionId = '0x8f2e0b7578694736181ac266cd9ed62e1e1173c59ba4ff8b87e79da88a901c72';
const integrator = 'jumper.exchange';
const referrer = '0x0000000000000000000000000000000000000000';
const minAmount = 80;
const swapData = [
    {
        callTo: '0x1111111254eeb25477b68fb85ed929f73a960582',
        approveTo: '0x1111111254eeb25477b68fb85ed929f73a960582',
        sendingAssetId: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
        receivingAssetId: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        fromAmount: '81',
        callData: '0x12aa3caf000000000000000000000000b97cd69145e5a9357b2acd6af6c5076380f17afb000000000000000000000000c2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa84174000000000000000000000000b78906c8a461d6a39a57285c129843e1937c32780000000000000000000000001231deb6f5749ef6ce6943a275a1d3e7486f4eae0000000000000000000000000000000000000000000000000000000000000051000000000000000000000000000000000000000000000000000000000000004f0000000000000000000000000000000000000000000000000000000000000004000000000000000000000000000000000000000000000000000000000000014000000000000000000000000000000000000000000000000000000000000001600000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000008500000000000000000000000000000000000000000000000000000000006700206ae4071138000f4240b78906c8a461d6a39a57285c129843e1937c32781111111254eeb25477b68fb85ed929f73a960582000000000000000000000000000000000000000000000000000000000000004fc2132d05d31c914a87c6611c10748aeb04b58e8f0000000000000000000000000000000000000000000000000000002e9b3012',
        requiresDeposit: true,
    },
];
const walletAddress = '0xd7C9F3b280D4690C3232469F3BCb4361632bfC77';
const receiver = walletAddress;
const swapTokenIn = '0xc2132D05D31c914a87C6611C10748AEb04B58e8F';
const params = {
    transactionId,
    integrator,
    receiver,
    referrer,
    minAmount,
    swapData
};
const chainIdTest = '137';
describe('Testing chains info', () => __awaiter(void 0, void 0, void 0, function* () {
    let gasypayManager;
    let gaspayConfig;
    let swapSig;
    before('Setting up Gaspay manager', () => {
        gasypayManager = new GaspayManager('7128931bksjdbfkj-fdsfsui8dfsf');
    });
    it('Getting config', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield gasypayManager.getGaspayConfigForCurrentSession(chainIdTest);
        gaspayConfig = result;
        const isValid = result ? true : false;
        expect(isValid).true;
    }));
    it('Checking for contract address for a given chain id', () => __awaiter(void 0, void 0, void 0, function* () {
        const contractAddress = yield getContractAddress(chainIdTest);
        expect(contractAddress).equal(polygonAdd);
    }));
    it('Getting nonce', () => __awaiter(void 0, void 0, void 0, function* () {
        const nonce = yield getNonce(walletAddress, swapTokenIn, abi);
        expect(nonce).greaterThan(0);
    }));
    it('Getting swap signature', () => __awaiter(void 0, void 0, void 0, function* () {
        swapSig = yield gasypayManager.generateSwapSignature('jumper-exchange', params, chainIdTest, walletAddress);
        console.log(swapSig, 'Swap signature...');
        const isValid = swapSig ? true : false;
        expect(isValid).true;
    }));
    it('Sending swap signature', () => __awaiter(void 0, void 0, void 0, function* () {
        const privKey = '';
        const signature = yield sigUtil.signTypedData({
            privateKey: Buffer.from(privKey.slice(2), "hex"),
            data: swapSig,
            version: "V4"
        });
        const result = yield gasypayManager.sendSwapTransaction('jumper-exchange', signature, params, chainIdTest, walletAddress);
        console.log(result, "Swap result");
        const isValid = result ? true : false;
        expect(isValid).true;
    }));
    // it('Approval testing', async function () {
    //     this.timeout(10000);
    //     const { dataToSign, functionSignature } = await gasypayManager.generateApprovalSignature(
    //         '0xd7C9F3b280D4690C3232469F3BCb4361632bfC77',
    //         '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    //         '137'
    //     );
    //     let signature: string | undefined = undefined;
    //     // Sign with private key
    //     if (process.env.PK) {
    //         console.log('Signing data...', dataToSign, '\t', process.env.PK);
    //         signature = await sigUtil.signTypedData({
    //             privateKey: Buffer.from(process.env.PK.slice(2), "hex"),
    //             data: dataToSign,
    //             version: "V4"
    //         });
    //         console.log('reached herer', signature);
    //     }
    //     if (!signature) throw new Error(ERROR.NO_SIGNATURE);
    //     const txDetails = await gasypayManager.sendApprovalTransaction(
    //         signature,
    //         functionSignature,
    //         '0xc2132D05D31c914a87C6611C10748AEb04B58e8F',
    //         '0xd7C9F3b280D4690C3232469F3BCb4361632bfC77',
    //         '137'
    //     );
    //     const hashPresent = txDetails.hash ? true: false;
    //     expect(hashPresent).equal(true);
    // })
}));
