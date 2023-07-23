type ApprovalSignature = {
    dataToSign: any;
    functionSignature: string;
};
type GaspayConfig = {
    contractUrl: string;
    providerUrl: string;
    contractABI: any;
};
export declare class GaspayManager {
    protected apiKey: string;
    /**
     * apiKey to initialize the Gaspaymanager
     * This api key is going to be used for backend api calls
     * business using this sdk must get this api key from Flint
     * @param apiKey
     */
    constructor(apiKey: string);
    /**
     *
     * @param walletAddress User current signed in wallet address
     * @param fromToken From token selected in the UI for swap
     * @param chainId chain id for selected network
     * @returns approval signature to be passed to the frontend
     */
    generateApprovalSignature(walletAddress: string, fromToken: string, chainId: string): Promise<ApprovalSignature>;
    /**
     *
     * @param signature EIP2771 compatible Native meta transaction
     * @param functionSignature signature of the function to be used in meta transaction
     * @param fromToken from token selected in the swap frontend
     * @param walletAddress user's wallet address
     * @returns transaction data from blockchain
     */
    sendApprovalTransaction(signature: string, functionSignature: string, fromToken: string, walletAddress: string, chainId: string): Promise<any>;
    /**
     *
     * @param merchantApiKey Merchant API key given by Flint to merchant on onboarding
     * @param params Params required to sign
     * @param chainId connected chainId of user wallet
     * @param walletAddress connected user's wallet address
     * @returns signature to be signed by user
     */
    generateSwapSignature(merchantApiKey: string, params: any, chainId: string, walletAddress: string): Promise<string | undefined>;
    sendSwapTransaction(merchantApiKey: string, signature: string, params: any, chainId: string, walletAddress: string): Promise<any>;
    getGaspayConfigForCurrentSession(chainId: string): Promise<GaspayConfig | undefined>;
}
export {};
