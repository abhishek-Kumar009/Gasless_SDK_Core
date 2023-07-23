var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { abi } from '../abis/ERC20';
import Web3 from 'web3';
import axios from 'axios';
import { ethers } from 'ethers';
var FlintContracts;
(function (FlintContracts) {
    FlintContracts["POLYGON"] = "0xae294F66775eDd9C81f4540eAdA41Bc1E4eE22AD";
})(FlintContracts || (FlintContracts = {}));
var ERROR;
(function (ERROR) {
    ERROR["UNSUPPORTED"] = "Unsupported chain. Please contact support";
    ERROR["NO_CHAIN"] = "No chains found";
    ERROR["APPROVAL_FAILED"] = "Invalid approval status";
})(ERROR || (ERROR = {}));
const domainType = [
    { name: 'name', type: 'string' },
    { name: 'version', type: 'string' },
    { name: 'verifyingContract', type: 'address' },
    { name: 'salt', type: 'bytes32' },
];
const metaTransactionType = [
    { name: 'nonce', type: 'uint256' },
    { name: 'from', type: 'address' },
    { name: 'functionSignature', type: 'bytes' },
];
export const getSignatureParameters = (signature) => {
    if (!Web3.utils.isHexStrict(signature)) {
        throw new Error('Given value "'.concat(signature, '" is not a valid hex string.'));
    }
    const sigR = signature.slice(0, 66);
    const sigS = '0x'.concat(signature.slice(66, 130));
    let sigV = '0x'.concat(signature.slice(130, 132));
    sigV = Web3.utils.hexToNumber(sigV);
    if (![27, 28].includes(sigV))
        sigV += 27;
    return {
        r: sigR,
        s: sigS,
        v: sigV,
    };
};
export const getNonce = (walletAddress, targetContract, targetAbi) => __awaiter(void 0, void 0, void 0, function* () {
    // TODO Get config for provider URLs from backend
    const provider = new ethers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/6YG2I64dtdEnsF68sTYQIYy--Fa5roqh');
    const tokenContract = new ethers.Contract(targetContract, targetAbi, provider);
    const nonce = yield tokenContract.getNonce(walletAddress);
    return parseInt(nonce, 10);
});
export const getContractAddress = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    // Make the api call to backend for all supported chains
    const results = yield axios.get(`http://localhost:3000/faucet/v1/bridge/config`);
    const { chains } = results.data;
    if (chains.length === 0)
        throw new Error(ERROR.NO_CHAIN);
    const arrChains = Object.values(chains);
    const currentChainInfo = arrChains.find((item) => chainId === item.chainId.toString());
    // return contract address for the chainId
    if (currentChainInfo === null || currentChainInfo === void 0 ? void 0 : currentChainInfo.destinationAddress)
        return currentChainInfo.destinationAddress;
    throw new Error(ERROR.UNSUPPORTED);
});
export const generateFunctionSignature = (targetAbi, chainId) => __awaiter(void 0, void 0, void 0, function* () {
    const iface = new ethers.Interface(targetAbi);
    // Approve amount for spender 1 matic
    return iface.encodeFunctionData('approve', [
        yield getContractAddress(chainId),
        ethers.parseEther('10000'),
    ]);
});
export const getFlintContractDetails = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const config = yield getGaspayConfig(chainId);
        const provider = new ethers.JsonRpcProvider(config === null || config === void 0 ? void 0 : config.providerUrl);
        const contractAddress = config === null || config === void 0 ? void 0 : config.contractUrl;
        const contractAbi = config === null || config === void 0 ? void 0 : config.contractABI;
        if (!contractAddress)
            throw new Error('Failed to fetch contract address!!');
        const flintContract = new ethers.Contract(contractAddress, contractAbi, provider);
        return { flintContract, contractAddress };
    }
    catch (error) {
        console.log(error, "Error in getFlintContractDetails");
    }
});
const getName = (tokenAddress) => __awaiter(void 0, void 0, void 0, function* () {
    // update method to check if ABI has getNonce or nonces
    const provider = new ethers.JsonRpcProvider('https://polygon-mainnet.g.alchemy.com/v2/oYL3zphjRJ5SgPB04yLeh2oh0BvtcQuI');
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    return yield tokenContract.name();
});
export const formatMetaTransactionSignature = (nonce, targetFunctionSignature, walletAddress, fromToken) => __awaiter(void 0, void 0, void 0, function* () {
    const messagePayload = {
        nonce: parseInt(nonce, 10),
        from: walletAddress,
        functionSignature: targetFunctionSignature,
    };
    const dataToSign = {
        types: {
            EIP712Domain: domainType,
            MetaTransaction: metaTransactionType,
        },
        domain: {
            name: yield getName(fromToken),
            version: '1',
            verifyingContract: fromToken,
            salt: '0x0000000000000000000000000000000000000000000000000000000000000089',
        },
        primaryType: 'MetaTransaction',
        message: messagePayload,
    };
    return dataToSign;
});
export const sendNativeApprovalTxn = (signature, functionSignature, fromToken, walletAddress, targetChainId) => __awaiter(void 0, void 0, void 0, function* () {
    const { r, s, v } = getSignatureParameters(signature);
    const approvalData = {
        params: {
            r,
            s,
            v,
            functionSignature,
            userAddress: walletAddress,
        },
        chainId: targetChainId,
        type: 'EMT',
        approvalContractAddress: fromToken
    };
    const txResp = yield axios.post(`http://localhost:3000/faucet/v1/swap/approve`, approvalData);
    return txResp.data;
});
export const getGaspayConfig = (chainId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield axios.get(`http://localhost:3000/faucet/v1/config/gas-router-config?chainId=${chainId}`);
        const result = resp.data;
        return result;
    }
    catch (error) {
        console.log(error, 'Error in getGaspayConfig');
    }
});
