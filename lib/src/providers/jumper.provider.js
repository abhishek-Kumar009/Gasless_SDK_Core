var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import axios from 'axios';
import { getFlintContractDetails, getSignatureParameters } from '../utils';
import Web3 from 'web3';
const SwapWithJumperGasless = [
    { type: 'uint', name: 'nonce' },
    { type: 'uint', name: 'minAmount' },
    { type: 'address', name: 'receiver' },
    { type: 'bytes32', name: 'transactionId' }
];
const domainType = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'verifyingContract', type: 'address' },
    { name: 'salt', type: 'bytes32' },
];
const swapTransaction = (signature, params, chainId, walletAddress, merchantApiKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // send to relayer
        const contractDetails = yield getFlintContractDetails(chainId);
        const flintContract = contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.flintContract;
        const NONCE = yield (flintContract === null || flintContract === void 0 ? void 0 : flintContract.nonces(walletAddress));
        const { r, s, v } = getSignatureParameters(signature);
        const payload = {
            params,
            sigR: r,
            sigS: s,
            sigV: v,
            chainId,
            nonce: parseInt(NONCE, 10),
            walletAddress,
            merchantApiKey
        };
        const resp = yield axios.post(`http://localhost:3000/faucet/v1/swap/gasless-merchant-swap`, payload);
        return resp.data;
    }
    catch (error) {
        console.log(error, "Error in swapTransaction");
    }
});
const getSwapSignature = (params, chainId, walletAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(params, "Params for swap...");
        const contractDetails = yield getFlintContractDetails(chainId);
        const flintContract = contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.flintContract;
        const contractAddress = contractDetails === null || contractDetails === void 0 ? void 0 : contractDetails.contractAddress;
        const NONCE = yield (flintContract === null || flintContract === void 0 ? void 0 : flintContract.nonces(walletAddress));
        console.log(NONCE, "NONCE for flint contract!!");
        const { transactionId, integrator, referrer, receiver, minAmount, swapData } = params;
        // Format message to be signed
        const messagePayload = {
            nonce: parseInt(NONCE, 10),
            minAmount,
            receiver,
            transactionId
        };
        const salt = Web3.utils.padLeft(`0x${parseInt(chainId).toString(16)}`, 64);
        console.log(salt, "Salt here$$$");
        // const salt = '0x0000000000000000000000000000000000000000000000000000000000000089';
        const dataToSign = {
            types: {
                EIP712Domain: domainType,
                SwapWithoutFeesJumper: SwapWithJumperGasless,
            },
            domain: {
                name: yield (flintContract === null || flintContract === void 0 ? void 0 : flintContract.name()),
                version: '1',
                verifyingContract: contractAddress,
                salt,
            },
            primaryType: 'SwapWithoutFeesJumper',
            message: messagePayload,
        };
        return dataToSign;
    }
    catch (error) {
        console.log(error, 'Error in getSwapSignature');
    }
});
const getKey = () => {
    return 'jumper-exchange';
};
export default {
    swapTransaction,
    getKey,
    getSwapSignature
};
