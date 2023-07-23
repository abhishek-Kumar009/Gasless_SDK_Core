import { Contract } from 'ethers';
type GaspayConfig = {
    contractUrl: string;
    providerUrl: string;
    contractABI: any;
};
type ApprovalMessage = {
    nonce: number;
    from: string;
    functionSignature: string;
};
type ContractDetails = {
    flintContract: Contract;
    contractAddress: string;
};
export declare const getSignatureParameters: (signature: string) => {
    r: string;
    s: string;
    v: any;
};
export declare const getNonce: (walletAddress: string, targetContract: string, targetAbi: any) => Promise<number>;
export declare const getContractAddress: (chainId: string) => Promise<string>;
export declare const generateFunctionSignature: (targetAbi: any, chainId: string) => Promise<string>;
export declare const getFlintContractDetails: (chainId: string) => Promise<ContractDetails | undefined>;
export declare const formatMetaTransactionSignature: (nonce: string, targetFunctionSignature: string, walletAddress: string, fromToken: string) => Promise<{
    types: {
        EIP712Domain: {
            name: string;
            type: string;
        }[];
        MetaTransaction: {
            name: string;
            type: string;
        }[];
    };
    domain: {
        name: any;
        version: string;
        verifyingContract: string;
        salt: string;
    };
    primaryType: string;
    message: ApprovalMessage;
}>;
export declare const sendNativeApprovalTxn: (signature: string, functionSignature: string, fromToken: string, walletAddress: string, targetChainId: string) => Promise<any>;
export declare const getGaspayConfig: (chainId: string) => Promise<GaspayConfig | undefined>;
export {};
