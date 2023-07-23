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
import { getMerchantForSwapTransaction } from '../factories/merchant.factory';
import { getNonce, generateFunctionSignature, formatMetaTransactionSignature, sendNativeApprovalTxn, getGaspayConfig } from '../utils';
const providers = {
    137: {
        chainId: '137',
        rpcUrl: 'https://polygon-mainnet.g.alchemy.com/v2/6YG2I64dtdEnsF68sTYQIYy--Fa5roqh',
        flintContract: ''
    }
};
export class GaspayManager {
    /**
     * apiKey to initialize the Gaspaymanager
     * This api key is going to be used for backend api calls
     * business using this sdk must get this api key from Flint
     * @param apiKey
     */
    constructor(apiKey) {
        this.apiKey = apiKey;
        // TODO Download the config from backend on initalization
        // Things like provider Urls, flint contract info etc
    }
    /**
     *
     * @param walletAddress User current signed in wallet address
     * @param fromToken From token selected in the UI for swap
     * @param chainId chain id for selected network
     * @returns approval signature to be passed to the frontend
     */
    generateApprovalSignature(walletAddress, fromToken, chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const nonce = yield getNonce(walletAddress, fromToken, abi);
            const functionSignature = yield generateFunctionSignature(abi, chainId);
            const dataToSign = yield formatMetaTransactionSignature(nonce.toString(), functionSignature, walletAddress, fromToken);
            // TODO Return this as JSON.stringify(dataToSign) for metamask signing from user side 
            return { dataToSign, functionSignature };
        });
    }
    /**
     *
     * @param signature EIP2771 compatible Native meta transaction
     * @param functionSignature signature of the function to be used in meta transaction
     * @param fromToken from token selected in the swap frontend
     * @param walletAddress user's wallet address
     * @returns transaction data from blockchain
     */
    sendApprovalTransaction(signature, functionSignature, fromToken, walletAddress, chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const approvalData = yield sendNativeApprovalTxn(signature, functionSignature, fromToken, walletAddress, chainId);
            return approvalData;
        });
    }
    /**
     *
     * @param merchantApiKey Merchant API key given by Flint to merchant on onboarding
     * @param params Params required to sign
     * @param chainId connected chainId of user wallet
     * @param walletAddress connected user's wallet address
     * @returns signature to be signed by user
     */
    generateSwapSignature(merchantApiKey, params, chainId, walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the provider
            const swapProvider = getMerchantForSwapTransaction(merchantApiKey);
            const sigToSign = yield swapProvider.getSwapSignature(params, chainId, walletAddress);
            return sigToSign;
        });
    }
    sendSwapTransaction(merchantApiKey, signature, params, chainId, walletAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            // Get the provider
            const swapProvider = getMerchantForSwapTransaction(merchantApiKey);
            const resp = yield swapProvider.swapTransaction(signature, params, chainId, walletAddress, merchantApiKey);
            return resp;
        });
    }
    getGaspayConfigForCurrentSession(chainId) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield getGaspayConfig(chainId);
            return result;
        });
    }
}
;
