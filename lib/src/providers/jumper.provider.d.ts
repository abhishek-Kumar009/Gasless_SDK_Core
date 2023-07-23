interface SwapData {
    callTo: string;
    approveTo: string;
    sendingAssetId: string;
    receivingAssetId: string;
    fromAmount: string;
    callData: string;
    requiresDeposit: boolean;
}
interface JumperExchangeParams {
    transactionId: string;
    integrator: string;
    referrer: string;
    receiver: string;
    minAmount: string;
    swapData: SwapData;
}
declare const _default: {
    swapTransaction: (signature: string, params: JumperExchangeParams, chainId: string, walletAddress: string, merchantApiKey: string) => Promise<any>;
    getKey: () => string;
    getSwapSignature: (params: JumperExchangeParams, chainId: string, walletAddress: string) => Promise<unknown>;
};
export default _default;
